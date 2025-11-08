/**
 * Funnel & Session Calculator
 * ----------------------------------------
 * Mengubah deretan event xAPI yang sudah dinormalisasi menjadi data
 * funnel standar (initialized → experienced → progressed → completed)
 * sekaligus metrik sesi untuk disimpan pada model FunnelResult.
 */

const SESSION_GAP_MINUTES = 30;
const SESSION_GAP_MS = SESSION_GAP_MINUTES * 60 * 1000;

const FUNNEL_STAGES = ["initialized", "experienced", "progressed", "completed"];

const VERB_KEYWORDS = {
  initialized: ["initialized"],
  experienced: ["experienced", "interacted", "attempted"], // fallback jika LMS memakai verb sejenis
  progressed: ["progressed", "answered"],
  completed: ["completed", "passed", "submitted"],
};

const HISTOGRAM_BINS = [
  { label: "0-5m", min: 0, max: 5 },
  { label: "5-10m", min: 5, max: 10 },
  { label: "10-15m", min: 10, max: 15 },
  { label: "15-30m", min: 15, max: 30 },
  { label: "30-60m", min: 30, max: 60 },
  { label: "60m+", min: 60, max: Infinity },
];

const normalizeString = (value, fallback = "") => {
  if (!value) return fallback;
  return String(value).trim() || fallback;
};

const parseTimestamp = (value) => {
  if (!value) return null;
  const date = new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
};

const matchStageFromVerb = (verbRaw) => {
  const verb = normalizeString(verbRaw).toLowerCase();
  if (!verb) return null;
  for (const [stage, keywords] of Object.entries(VERB_KEYWORDS)) {
    if (keywords.some((keyword) => verb === keyword || verb.endsWith(`/${keyword}`) || verb.includes(keyword))) {
      return stage;
    }
  }
  return null;
};

const buildHistogramBuckets = () =>
  HISTOGRAM_BINS.map((bin) => ({
    label: bin.label,
    min: bin.min,
    max: bin.max,
    count: 0,
  }));

const buildSessions = (normalizedRows) => {
  if (!Array.isArray(normalizedRows)) return [];

  const enhancedRows = normalizedRows
    .map((row) => {
      const actorId = normalizeString(row.actor_id || row.actorId, "unknown_actor");
      const sessionId = normalizeString(row.session_id || row.sessionId, "") || null;
      const verb = normalizeString(row.verb || row.verb_id || row.verbId);
      const timestampMs = parseTimestamp(row.timestamp || row.local_timestamp || row.time);
      return {
        ...row,
        actorId,
        sessionId,
        verb,
        timestampMs,
      };
    })
    .sort((a, b) => {
      if (a.actorId === b.actorId) {
        const timeA = a.timestampMs ?? Number.POSITIVE_INFINITY;
        const timeB = b.timestampMs ?? Number.POSITIVE_INFINITY;
        if (timeA === timeB) return 0;
        return timeA - timeB;
      }
      return a.actorId.localeCompare(b.actorId);
    });

  const sessionsByKey = new Map();
  const actorStates = new Map();

  for (const row of enhancedRows) {
    const actorState = actorStates.get(row.actorId) ?? {
      lastTimestamp: null,
      counter: 0,
      currentKey: null,
      lastSessionId: null,
    };
    const explicitSessionChanged = row.sessionId && row.sessionId !== actorState.lastSessionId;
    const hasGap = actorState.lastTimestamp !== null && row.timestampMs !== null && row.timestampMs - actorState.lastTimestamp > SESSION_GAP_MS;
    const shouldStartNew = !actorState.currentKey || explicitSessionChanged || hasGap;

    if (shouldStartNew) {
      actorState.counter += 1;
      const base = row.sessionId ? `explicit_${row.sessionId}` : `auto_${actorState.counter}`;
      actorState.currentKey = `${row.actorId}__${base}`;
    }

    actorState.lastTimestamp = row.timestampMs ?? actorState.lastTimestamp;
    actorState.lastSessionId = row.sessionId ?? actorState.lastSessionId;
    actorStates.set(row.actorId, actorState);

    const sessionKey = actorState.currentKey;

    if (!sessionsByKey.has(sessionKey)) {
      sessionsByKey.set(sessionKey, {
        id: sessionKey,
        actorId: row.actorId,
        events: [],
        start: row.timestampMs ?? null,
        end: row.timestampMs ?? null,
      });
    }

    const session = sessionsByKey.get(sessionKey);
    session.events.push(row);
    if (row.timestampMs !== null) {
      session.start = session.start === null ? row.timestampMs : Math.min(session.start, row.timestampMs);
      session.end = session.end === null ? row.timestampMs : Math.max(session.end, row.timestampMs);
    }
  }

  return Array.from(sessionsByKey.values());
};

const calculateFunnelSteps = (sessions) => {
  const counts = FUNNEL_STAGES.map(() => 0);

  sessions.forEach((session) => {
    const sortedEvents = [...session.events].sort((a, b) => {
      const timeA = a.timestampMs ?? Number.POSITIVE_INFINITY;
      const timeB = b.timestampMs ?? Number.POSITIVE_INFINITY;
      return timeA - timeB;
    });

    let lastTimestamp = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < FUNNEL_STAGES.length; i += 1) {
      const stage = FUNNEL_STAGES[i];
      const index = sortedEvents.findIndex((event) => {
        if (!event) return false;
        if (matchStageFromVerb(event.verb) !== stage) return false;
        if (lastTimestamp === Number.NEGATIVE_INFINITY) return true;
        const ts = event.timestampMs;
        if (ts === null) return true;
        return ts >= lastTimestamp;
      });

      if (index === -1) {
        break;
      }

      counts[i] += 1;
      const hitTimestamp = sortedEvents[index].timestampMs;
      if (hitTimestamp !== null) {
        lastTimestamp = hitTimestamp;
      }
    }
  });

  const firstCount = counts[0] || 0;
  return counts.map((count, idx) => {
    const prevCount = idx === 0 ? count : counts[idx - 1] || 0;
    const rate = firstCount ? count / firstCount : 0;
    const dropOff = idx === 0 || prevCount === 0 ? 0 : 1 - count / prevCount;
    return {
      stage: FUNNEL_STAGES[idx],
      count,
      rate: Number(rate.toFixed(4)),
      dropOff: Number(dropOff.toFixed(4)),
    };
  });
};

const calculateSessionMetrics = (sessions) => {
  if (!sessions.length) {
    return {
      avgSessionDuration: 0,
      totalSessions: 0,
      avgEventsPerSession: 0,
      sessionDurationHistogram: HISTOGRAM_BINS.map((bin) => ({ range: bin.label, count: 0 })),
    };
  }

  let totalDurationMinutes = 0;
  let totalEvents = 0;
  const histogramBuckets = buildHistogramBuckets();

  sessions.forEach((session) => {
    const durationMs = session.start !== null && session.end !== null ? Math.max(session.end - session.start, 0) : 0;
    const durationMinutes = durationMs / 60000;
    totalDurationMinutes += durationMinutes;
    totalEvents += session.events.length;

    const bucket = histogramBuckets.find((bin) => durationMinutes >= bin.min && durationMinutes < bin.max);
    if (bucket) {
      bucket.count += 1;
    }
  });

  const totalSessions = sessions.length;
  return {
    avgSessionDuration: Number((totalDurationMinutes / totalSessions).toFixed(2)),
    totalSessions,
    avgEventsPerSession: Number((totalEvents / totalSessions).toFixed(2)),
    sessionDurationHistogram: histogramBuckets.map(({ label, count }) => ({ range: label, count })),
  };
};

export function calculateFunnelAndSessionData(normalizedRows = []) {
  const sessions = buildSessions(normalizedRows);
  const funnelSteps = calculateFunnelSteps(sessions);
  const { avgSessionDuration, totalSessions, avgEventsPerSession, sessionDurationHistogram } = calculateSessionMetrics(sessions);

  return {
    funnelSteps,
    avgSessionDuration,
    totalSessions,
    avgEventsPerSession,
    sessionDurationHistogram,
  };
}
