"use client";

import Link from "next/link";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useThemeContext } from "../context/theme/ThemeContext";

const sections = [
  {
    id: "hero",
    headline: "Pahami Proses Kodingmu, Bukan Hanya Hasilnya.",
    alternate: "Temukan Insight Tersembunyi dari Setiap Ketukan Kode Anda.",
    tagline: "Melihat Lebih Dekat Pola Pengerjaan Kode Anda.",
    description:
      "DevLens adalah tools analisis cerdas yang mengubah data aktivitas pemrograman Anda menjadi umpan balik yang bisa ditindaklanjuti. Identifikasi di mana Anda sering membuat kesalahan, pahami pola debugging Anda, dan percepat proses belajar Anda.",
  },
  {
    id: "problems",
    title: "Kode Anda Sering Error, Tapi Bingung di Mana Salahnya?",
    items: [
      {
        label: "Debugging Berjam-jam",
        body: "Menghabiskan waktu terlalu lama pada satu bug yang ternyata sepele.",
      },
      {
        label: "Mengulang Kesalahan Sama",
        body: "Sering terjebak pada jenis error yang sama di berbagai tugas berbeda.",
      },
      {
        label: "Progress Stagnan",
        body: "Merasa sudah banyak mencoba tapi progres pengerjaan tugas terasa lambat.",
      },
      {
        label: "Sulit Memberi Bimbingan",
        body: "Mentor kesulitan melihat titik masalah mahasiswa tanpa memahami prosesnya.",
      },
    ],
  },
];

const features = [
  {
    icon: "[01]",
    title: "Peta Panas Error",
    body: 'Visualisasikan dengan jelas soal atau tugas mana yang menjadi "sarang" error Anda. DevLens mengelompokkan jenis kesalahan agar fokus belajar tepat sasaran.',
  },
  {
    icon: "[02]",
    title: "Detektor Pola Debugging",
    body: "Deteksi otomatis ketika Anda terjebak dalam siklus Run -> Error -> Edit. Dapatkan notifikasi cerdas sebelum burnout datang.",
  },
  {
    icon: "[03]",
    title: "Laporan Progres Mingguan",
    body: "Pantau Time-to-Fix dan distribusi waktu per tugas untuk membangun kebiasaan coding yang efektif.",
  },
];

const steps = [
  {
    title: "Unggah Data Log",
    body: "Ekspor data aktivitas (CSV xAPI) dari platform belajar Anda dan unggah ke DevLens.",
  },
  {
    title: "Proses Analisis",
    body: "Algoritma kami memetakan pola, anomali, serta titik kesulitan dari ribuan baris data.",
  },
  {
    title: "Dapatkan Insight",
    body: "Dashboard personal menampilkan visualisasi dan umpan balik siap pakai, hanya dalam hitungan detik.",
  },
];

const audiences = [
  {
    heading: "Untuk Mahasiswa & Programmer Pemula",
    description: "Dapatkan cermin digital untuk melihat proses belajar Anda sendiri. Identifikasi kelemahan, perbaiki kebiasaan buruk, dan percepat kurva belajar.",
  },
  {
    heading: "Untuk Dosen & Mentor",
    description: "Lihat kesulitan mahasiswa berbasis data. Bimbing dengan lebih personal dan tepat sasaran tanpa harus menebak-nebak.",
  },
];

function HeroPanel({ isDarkMode }) {
  const { headline, alternate, tagline, description } = sections[0];
  const themed = (light, dark) => (isDarkMode ? dark : light);

  return (
    <section id="hero" className={`grid gap-12 rounded-3xl border px-8 py-16 shadow-sm transition-colors md:px-12 lg:grid-cols-[1.1fr_1fr] ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <div className="flex flex-col gap-6">
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] transition-colors ${themed("text-slate-500", "text-slate-400")}`}>DevLens</p>
        <h1 className={`text-4xl font-semibold leading-tight md:text-5xl transition-colors ${themed("text-slate-900", "text-white")}`}>{headline}</h1>
        <p className={`text-lg font-medium transition-colors ${themed("text-slate-500", "text-slate-300")}`}>{alternate}</p>
        <p className={`text-base font-semibold transition-colors ${themed("text-slate-600", "text-slate-200")}`}>{tagline}</p>
        <p className={`text-base leading-relaxed transition-colors ${themed("text-slate-600", "text-slate-300")}`}>{description}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/convert"
            className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${themed("bg-slate-900 text-white hover:bg-slate-700", "bg-slate-100 text-slate-900 hover:bg-white")}`}
          >
            Mulai
          </Link>

          <a
            href="mailto:hello@devlens.io"
            className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${themed(
              "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900",
              "border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white"
            )}`}
          >
            Hubungi Kami
          </a>
        </div>
      </div>
      <div
        className={`relative isolate overflow-hidden rounded-3xl border p-8 shadow-inner transition-colors ${themed(
          "border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100",
          "border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-950"
        )}`}
      >
        <div className={`absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl ${themed("bg-cyan-100", "bg-cyan-500/20")}`} />
        <div className={`absolute -bottom-24 -left-10 h-48 w-48 rounded-full blur-3xl ${themed("bg-purple-100", "bg-purple-500/20")}`} />
        <div className={`relative flex h-full flex-col justify-between transition-colors ${themed("text-slate-700", "text-slate-200")}`}>
          <div>
            <p className={`text-xs uppercase tracking-[0.3em] transition-colors ${themed("text-slate-400", "text-slate-500")}`}>Snapshot Insight</p>
            <h2 className="mt-2 text-2xl font-semibold">Aktivitas 7 Hari</h2>
          </div>
          <div className={`mt-8 grid gap-6 rounded-2xl border p-6 shadow-sm transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium transition-colors ${themed("text-slate-500", "text-slate-400")}`}>Time-to-Fix</span>
              <span className={`text-2xl font-semibold transition-colors ${themed("text-slate-900", "text-white")}`}>
                34 <span className={`text-base font-medium transition-colors ${themed("text-slate-500", "text-slate-400")}`}> min</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={`rounded-xl border p-4 transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/50")}`}>
                <p className={`text-xs uppercase tracking-wide ${themed("text-cyan-600", "text-cyan-300")}`}>Syntax</p>
                <p className={`mt-1 text-xl font-semibold transition-colors ${themed("text-slate-900", "text-white")}`}>12</p>
              </div>
              <div className={`rounded-xl border p-4 transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/50")}`}>
                <p className={`text-xs uppercase tracking-wide ${themed("text-purple-600", "text-purple-300")}`}>Logic</p>
                <p className={`mt-1 text-xl font-semibold transition-colors ${themed("text-slate-900", "text-white")}`}>9</p>
              </div>
              <div className={`rounded-xl border p-4 transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/50")}`}>
                <p className={`text-xs uppercase tracking-wide ${themed("text-amber-600", "text-amber-300")}`}>Runtime</p>
                <p className={`mt-1 text-xl font-semibold transition-colors ${themed("text-slate-900", "text-white")}`}>5</p>
              </div>
            </div>
            <div className={`rounded-xl border border-dashed p-4 text-sm leading-relaxed transition-colors ${themed("border-slate-300 bg-white text-slate-500", "border-slate-600 bg-slate-900/40 text-slate-300")}`}>
              &quot;Run -&gt; Error -&gt; Edit&quot; terjadi 6 kali pada tugas WebAPI. Coba tinjau ulang pendekatanmu sebelum mencoba lagi.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection({ isDarkMode }) {
  const section = sections[1];
  const themed = (light, dark) => (isDarkMode ? dark : light);

  return (
    <section id="problems" className={`grid gap-8 rounded-3xl border px-8 py-16 shadow-sm transition-colors md:grid-cols-[0.9fr_1.1fr] md:px-12 ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <div>
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] transition-colors ${themed("text-slate-500", "text-slate-400")}`}>Pernah Mengalami Ini?</p>
        <h2 className={`mt-4 text-3xl font-semibold md:text-4xl transition-colors ${themed("text-slate-900", "text-white")}`}>{section.title}</h2>
      </div>
      <ul className="grid gap-6">
        {section.items.map(({ label, body }) => (
          <li key={label} className={`flex gap-4 rounded-2xl border p-5 transition ${themed("border-transparent bg-slate-50 hover:border-slate-200", "border-slate-700 bg-slate-900/50 hover:border-slate-500")}`}>
            <span className={`text-xl transition-colors ${themed("text-slate-400", "text-slate-500")}`}>-</span>
            <div>
              <p className={`text-base font-semibold transition-colors ${themed("text-slate-800", "text-white")}`}>{label}</p>
              <p className={`mt-1 text-sm leading-relaxed transition-colors ${themed("text-slate-600", "text-slate-300")}`}>{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function FeatureSection({ isDarkMode }) {
  const themed = (light, dark) => (isDarkMode ? dark : light);

  return (
    <section id="features" className="grid gap-10">
      <div className="text-center">
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] transition-colors ${themed("text-slate-500", "text-slate-400")}`}>Kenalkan DevLens!</p>
        <h2 className={`mt-4 text-3xl font-semibold md:text-4xl transition-colors ${themed("text-slate-900", "text-white")}`}>Temukan Jawabannya dengan Tiga Fitur Unggulan</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {features.map(({ icon, title, body }) => (
          <div key={title} className={`flex flex-col gap-4 rounded-3xl border p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
            <span className="text-3xl">{icon}</span>
            <p className={`text-lg font-semibold transition-colors ${themed("text-slate-900", "text-white")}`}>{title}</p>
            <p className={`text-sm leading-relaxed transition-colors ${themed("text-slate-600", "text-slate-300")}`}>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StepsSection({ isDarkMode }) {
  const themed = (light, dark) => (isDarkMode ? dark : light);

  return (
    <section id="workflow" className={`rounded-3xl border px-8 py-16 shadow-sm transition-colors md:px-12 ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <div className="max-w-3xl">
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] transition-colors ${themed("text-slate-500", "text-slate-400")}`}>Bagaimana DevLens Bekerja?</p>
        <h2 className={`mt-4 text-3xl font-semibold md:text-4xl transition-colors ${themed("text-slate-900", "text-white")}`}>Hanya 3 Langkah Sederhana</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
          {steps.map(({ title, body }, index) => (
            <li key={title} className={`flex flex-col gap-3 rounded-2xl border p-6 transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/50")}`}>
              <span className={`text-sm font-semibold uppercase tracking-[0.3em] transition-colors ${themed("text-slate-400", "text-slate-500")}`}>Langkah {index + 1}</span>
              <p className={`text-lg font-semibold transition-colors ${themed("text-slate-900", "text-white")}`}>{title}</p>
              <p className={`text-sm leading-relaxed transition-colors ${themed("text-slate-600", "text-slate-300")}`}>{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function AudienceSection({ isDarkMode }) {
  const themed = (light, dark) => (isDarkMode ? dark : light);

  return (
    <section id="audience" className={`grid gap-8 rounded-3xl border px-8 py-16 shadow-sm transition-colors md:grid-cols-2 md:px-12 ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <div className="md:col-span-2">
        <p className={`text-sm font-semibold uppercase tracking-[0.3em] transition-colors ${themed("text-slate-500", "text-slate-400")}`}>Dibuat untuk...</p>
        <h2 className={`mt-4 text-3xl font-semibold md:text-4xl transition-colors ${themed("text-slate-900", "text-white")}`}>Siapa yang Paling Diuntungkan?</h2>
      </div>
      {audiences.map(({ heading, description }) => (
        <article key={heading} className={`flex flex-col gap-3 rounded-2xl border p-6 transition-colors ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/50")}`}>
          <h3 className={`text-xl font-semibold transition-colors ${themed("text-slate-900", "text-white")}`}>{heading}</h3>
          <p className={`text-sm leading-relaxed transition-colors ${themed("text-slate-600", "text-slate-300")}`}>{description}</p>
        </article>
      ))}
    </section>
  );
}

function FinalCtaSection({ isDarkMode }) {
  const themed = (light, dark) => (isDarkMode ? dark : light);

  return (
    <section id="cta" className={`rounded-3xl border px-8 py-16 text-center shadow-md transition-colors md:px-12 ${themed("border-slate-200 bg-white", "border-slate-700 bg-slate-900/60")}`}>
      <h2 className={`text-3xl font-semibold md:text-4xl transition-colors ${themed("text-slate-900", "text-white")}`}>Siap Mengubah Cara Anda Menganalisis Proses Koding?</h2>
      <p className={`mt-4 text-base transition-colors ${themed("text-slate-600", "text-slate-300")}`}>Jadwalkan sesi demo personal untuk melihat bagaimana DevLens menyoroti pola koding unik Anda.</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a
          href="mailto:hello@devlens.io"
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${themed("bg-slate-900 text-white hover:bg-slate-700", "bg-slate-100 text-slate-900 hover:bg-white")}`}
        >
          Hubungi untuk Demo Proyek
        </a>
        <a
          href="#hero"
          className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${themed(
            "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900",
            "border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white"
          )}`}
        >
          Kembali ke Atas
        </a>
      </div>
    </section>
  );
}

function Footer({ isDarkMode }) {
  const themed = (light, dark) => (isDarkMode ? dark : light);

  return (
    <footer className={`mt-16 rounded-3xl border px-8 py-10 text-sm shadow-sm transition-colors md:px-12 ${themed("border-slate-200 bg-white text-slate-500", "border-slate-700 bg-slate-900/60 text-slate-400")}`}>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className={`font-semibold transition-colors ${themed("text-slate-700", "text-slate-200")}`}>Copyright 2025 DevLens. Sebuah Proyek Tugas Akhir.</p>
          <p className={`mt-1 transition-colors ${themed("text-slate-500", "text-slate-400")}`}>Nama Anda | NIM Anda | Logo Universitas</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href="mailto:hello@devlens.io" className={`underline-offset-4 transition hover:underline ${themed("hover:text-slate-900", "hover:text-white")}`}>
            hello@devlens.io
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className={`underline-offset-4 transition hover:underline ${themed("hover:text-slate-900", "hover:text-white")}`}>
            LinkedIn
          </a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className={`underline-offset-4 transition hover:underline ${themed("hover:text-slate-900", "hover:text-white")}`}>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { isDark, toggle, ready } = useThemeContext();

  const pageBackground = isDark ? "bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950 text-slate-100" : "bg-white text-slate-900";
  const backdropClass = isDark ? "bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.08)_0,_rgba(0,0,0,0)_60%)]" : "bg-transparent";

  return (
    <div className={`relative min-h-screen px-6 py-16 transition-colors duration-300 ${pageBackground}`}>
      <div className={`absolute inset-0 -z-10 transition-colors duration-300 ${backdropClass}`} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <div className="flex justify-end">{ready && <ThemeToggle isDark={isDark} onToggle={toggle} />}</div>
        <HeroPanel isDarkMode={isDark} />
        <ProblemSection isDarkMode={isDark} />
        <FeatureSection isDarkMode={isDark} />
        <StepsSection isDarkMode={isDark} />
        <AudienceSection isDarkMode={isDark} />
        <FinalCtaSection isDarkMode={isDark} />
      </main>
      <Footer isDarkMode={isDark} />
    </div>
  );
}
