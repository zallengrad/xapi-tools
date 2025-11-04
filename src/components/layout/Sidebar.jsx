"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useThemeContext } from "@/context/theme/ThemeContext";
import {
  FiUploadCloud,
  FiBarChart2,
  FiLogOut,
  FiUser, // Fallback icon
  FiLoader, // Loading icon
  FiChevronDown,
} from "react-icons/fi";

// Komponen internal untuk satu item link navigasi
function NavLink({ href, icon: Icon, children, isDark }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const activeClass = isDark ? "bg-sky-900/40 text-sky-300" : "bg-sky-100 text-sky-700";
  const inactiveClass = isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100";

  return (
    <Link href={href} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeClass : inactiveClass}`}>
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
}

function AnalysisNav({ items, isDark }) {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/dashboard/analysis");

  const summaryShell = isDark
    ? "bg-sky-900/40 text-sky-300"
    : "bg-sky-100 text-sky-700";
  const summaryBase = isDark
    ? "text-slate-400 hover:bg-slate-800"
    : "text-slate-600 hover:bg-slate-100";
  const summaryClass = isActive ? summaryShell : summaryBase;
  const dropdownShell = isDark ? "border-slate-800/60" : "border-slate-200";
  const itemClass = isDark
    ? "text-slate-300 hover:bg-slate-800 hover:text-sky-200"
    : "text-slate-600 hover:bg-slate-100 hover:text-sky-600";
  const seeAllClass = isDark
    ? "text-sky-200 hover:text-sky-100"
    : "text-sky-600 hover:text-sky-500";

  return (
    <details className="group mt-1 space-y-2" open>
      <summary
        className={`group flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${summaryClass}`}
      >
        <span className="flex items-center gap-3">
          <FiBarChart2 className="h-5 w-5" />
          <span>Hasil Analisis</span>
        </span>
        <FiChevronDown className="h-4 w-4 opacity-80 transition-transform group-open:rotate-180" />
      </summary>

      <div
        className={`overflow-hidden rounded-xl border ${dropdownShell}`}
      >
        <ul className="flex flex-col py-2 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`block px-4 py-2 transition-colors ${itemClass}`}
              >
                <span className="line-clamp-1">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors dark:border-slate-800">
          <Link href="/dashboard/analysis" className={`inline-flex items-center gap-2 ${seeAllClass}`}>
            Lihat Semua
          </Link>
        </div>
      </div>
    </details>
  );
}

// Komponen Sidebar Utama
export default function Sidebar() {
  const { data: session, status } = useSession();
  const { isDark } = useThemeContext();

  const navLinks = [
    { href: "/dashboard/convert", label: "Upload Data", icon: FiUploadCloud },
    // Tambahkan link lain di sini jika perlu
    // { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  ];

  const recentAnalyses = [
    { id: "history-1", title: "kelas-algo-a.csv", href: "/dashboard/analysis?demo=kelas-algo-a" },
    { id: "history-2", title: "xapi-lab-b.csv", href: "/dashboard/analysis?demo=xapi-lab-b" },
    { id: "history-3", title: "learning-path-s10.csv", href: "/dashboard/analysis?demo=learning-path-s10" },
    { id: "history-4", title: "kolaborasi-squad-7.csv", href: "/dashboard/analysis?demo=kolaborasi-squad-7" },
    { id: "history-5", title: "refleksi-sesi-final.csv", href: "/dashboard/analysis?demo=refleksi-sesi-final" },
  ];

  const sidebarShell = isDark ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900";

  return (
    <aside className={`fixed left-0 top-0 flex h-full w-64 flex-col border-r ${sidebarShell} transition-colors duration-300`}>
      {/* 1. Logo/Judul Aplikasi */}
      <div className={`flex h-16 shrink-0 items-center border-b px-6 transition-colors duration-300 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <Link href="/dashboard/convert" className="flex items-center gap-2">
          {/* Ganti dengan logo Anda jika ada */}
          <span className={`text-xl font-bold transition-colors ${isDark ? "text-sky-500" : "text-sky-600"}`}>DevLens</span>
        </Link>
      </div>

      {/* 2. Area Navigasi (Bisa di-scroll jika link banyak) */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} icon={link.icon} isDark={isDark}>
              {link.label}
            </NavLink>
          ))}
          <AnalysisNav items={recentAnalyses} isDark={isDark} />
        </nav>
      </div>

      {/* 3. Area User & Logout (di bawah) */}
      <div className={`mt-auto border-t p-4 transition-colors duration-300 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        {status === "loading" && (
          <div className="flex items-center gap-3">
            <FiLoader className={`h-9 w-9 animate-spin ${isDark ? "text-slate-500" : "text-slate-400"}`} />
            <div>
              <p className={`text-sm font-medium ${isDark ? "text-slate-300" : "text-slate-700"}`}>Memuat...</p>
            </div>
          </div>
        )}

        {status === "authenticated" && session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image ? <Image src={session.user.image} alt={session.user.name || "Avatar"} width={36} height={36} className="rounded-full" /> : <span className={`flex h-9 w-9 items-center justify-center rounded-full ${isDark ? "bg-slate-700" : "bg-slate-200"}`}><FiUser className={`h-5 w-5 ${isDark ? "text-slate-400" : "text-slate-500"}`} /></span>}
            <div className="flex-1 overflow-hidden">
              <p className={`truncate text-sm font-semibold transition-colors ${isDark ? "text-slate-100" : "text-slate-800"}`}>{session.user.name || "Pengguna"}</p>
              <p className={`truncate text-xs transition-colors ${isDark ? "text-slate-400" : "text-slate-500"}`}>{session.user.email}</p>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/login" })} title="Logout" className={`ml-2 rounded-md p-2 transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-100" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
