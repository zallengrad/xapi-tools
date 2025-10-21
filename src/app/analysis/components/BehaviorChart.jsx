"use client";
import { useState, useEffect, useMemo } from "react";

const BehaviorChart = ({ transitions }) => {
  const edges = transitions ?? [];
  const [positionedNodes, setPositionedNodes] = useState([]);

  const nodes = useMemo(() => {
    if (!edges.length) return [];
    return Array.from(new Set(edges.flatMap((item) => [item.from, item.to])));
  }, [edges]);

  const size = 600;
  const center = size / 2;
  const nodeWidth = 50;
  const nodeHeight = 62;

  useEffect(() => {
    if (!nodes.length) {
      setPositionedNodes([]);
      return;
    }

    let simulationNodes = nodes.map((name) => ({
      name,
      x: center + (Math.random() - 0.5) * 50,
      y: center + (Math.random() - 0.5) * 50,
      vx: 0,
      vy: 0,
    }));

    const iterations = 200;
    const kRepel = 20000;
    const kAttract = 0.02;
    const kGravity = 0.01;
    const damping = 0.9;

    for (let i = 0; i < iterations; i++) {
      // 1. Repulsion
      simulationNodes.forEach((node1) => {
        simulationNodes.forEach((node2) => {
          if (node1 === node2) return;
          const dx = node1.x - node2.x;
          const dy = node1.y - node2.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = kRepel / (distance * distance);
          node1.vx += (dx / distance) * force;
          node1.vy += (dy / distance) * force;
        });
      });

      // 2. Attraction
      edges.forEach((edge) => {
        if (edge.from === edge.to) return; // Abaikan self-loops untuk gaya tarik
        const fromNode = simulationNodes.find((n) => n.name === edge.from);
        const toNode = simulationNodes.find((n) => n.name === edge.to);
        if (!fromNode || !toNode) return;

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;

        fromNode.vx += dx * kAttract;
        fromNode.vy += dy * kAttract;
        toNode.vx -= dx * kAttract;
        toNode.vy -= dy * kAttract;
      });

      // 3. Gravity
      simulationNodes.forEach((node) => {
        const dx = center - node.x;
        const dy = center - node.y;
        node.vx += dx * kGravity;
        node.vy += dy * kGravity;
      });

      // 4. Collision
      simulationNodes.forEach((node1) => {
        simulationNodes.forEach((node2) => {
          if (node1 === node2) return;
          const dx = node2.x - node1.x;
          const dy = node2.y - node1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = nodeWidth + 10;

          if (distance < minDistance) {
            const overlap = (minDistance - distance) / 2;
            const adjustX = overlap * (dx / distance || 0);
            const adjustY = overlap * (dy / distance || 0);

            node1.x -= adjustX;
            node1.y -= adjustY;
            node2.x += adjustX;
            node2.y += adjustY;
          }
        });
      });

      // 5. Apply velocity
      simulationNodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        node.x = Math.max(nodeWidth / 2, Math.min(size - nodeWidth / 2, node.x));
        node.y = Math.max(nodeHeight / 2, Math.min(size - nodeHeight / 2, node.y));

        node.vx *= damping;
        node.vy *= damping;
      });
    }

    setPositionedNodes(simulationNodes);
  }, [nodes, edges]);

  if (!edges.length) {
    return <div className="mt-8 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">Tidak ada transisi signifikan untuk divisualisasikan.</div>;
  }

  const nodeMap = useMemo(
    () =>
      positionedNodes.reduce((map, node) => {
        map[node.name] = node;
        return map;
      }, {}),
    [positionedNodes]
  );

  const getLinePoints = (fromNode, toNode) => {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = (dx / length) * (nodeWidth / 2 + 5);
    const uy = (dy / length) * (nodeHeight / 2 + 5);

    return {
      startX: fromNode.x,
      startY: fromNode.y,
      endX: toNode.x - ux,
      endY: toNode.y - uy,
    };
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Pola Transisi Signifikan</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Panah menunjukkan alur urutan perilaku dengan nilai Z-score ≥ 1.96.</p>
      <div className="mt-6 flex justify-center overflow-auto">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#4b5563" />
            </marker>
          </defs>
          <g>
            {edges.map((edge, index) => {
              const fromNode = nodeMap[edge.from];
              const toNode = nodeMap[edge.to];
              if (!fromNode || !toNode) return null;

              // --- LOGIKA BARU UNTUK SELF-LOOP ---
              if (fromNode === toNode) {
                const loopRadius = 25;
                const startX = fromNode.x + nodeWidth / 4;
                const startY = fromNode.y - nodeHeight / 2;
                const endX = fromNode.x + nodeWidth / 2;
                const endY = fromNode.y - nodeHeight / 4;

                // Posisi label Z-score di puncak lengkungan
                const textX = fromNode.x + nodeWidth / 2 + loopRadius / 1.5;
                const textY = fromNode.y - nodeHeight / 2 - loopRadius / 1.5;

                const pathData = `M ${startX},${startY} A ${loopRadius},${loopRadius} 0 1,1 ${endX},${endY}`;

                return (
                  <g key={`${edge.from}-${edge.to}-${index}`}>
                    <path d={pathData} stroke="#4b5563" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                    <text x={textX} y={textY} textAnchor="middle" className="text-xs fill-gray-600 font-medium">
                      {edge.z.toFixed(2)}
                    </text>
                  </g>
                );
              }
              // --- AKHIR LOGIKA SELF-LOOP ---

              // Logika lama untuk garis lurus
              const { startX, startY, endX, endY } = getLinePoints(fromNode, toNode);
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;

              return (
                <g key={`${edge.from}-${edge.to}-${index}`}>
                  <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="#4b5563" strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <text x={midX} y={midY - 8} textAnchor="middle" className="text-xs fill-gray-600 font-medium">
                    {edge.z.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </g>
          <g>
            {positionedNodes.map((node) => (
              <g key={node.name} transform={`translate(${node.x}, ${node.y})`}>
                <rect x={-nodeWidth / 2} y={-nodeHeight / 2} width={nodeWidth} height={nodeHeight} rx={12} ry={12} fill="#ffffff" stroke="#94a3b8" strokeWidth="1.5" className="drop-shadow-sm" />
                <text y={4} textAnchor="middle" className="text-lg font-semibold fill-gray-700">
                  {node.name}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default BehaviorChart;
