"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  FiX,
} from "react-icons/fi";

// Komponen internal untuk satu item link navigasi
function NavLink({ href, icon: Icon, children, isDark, onNavigate }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const activeClass = isDark ? "bg-sky-900/40 text-sky-300" : "bg-sky-100 text-sky-700";
  const inactiveClass = isDark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeClass : inactiveClass}`}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
}

function AnalysisNav({ items, isDark, isLoading, onNavigate }) {
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
          {isLoading ? (
            <li className={`px-4 py-2 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Memuat...</li>
          ) : items.length ? (
            items.map((item) => (
              <li key={item.id}>
                <Link href={item.href} onClick={onNavigate} className={`block px-4 py-2 transition-colors ${itemClass}`}>
                  <span className="line-clamp-1">{item.title}</span>
                </Link>
              </li>
            ))
          ) : (
            <li className={`px-4 py-2 text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>
              Belum ada hasil.
            </li>
          )}
        </ul>
        <div className="border-t border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors dark:border-slate-800">
          <Link href="/dashboard/analysis" onClick={onNavigate} className={`inline-flex items-center gap-2 ${seeAllClass}`}>
            Lihat Semua
          </Link>
        </div>
      </div>
    </details>
  );
}

// Komponen Sidebar Utama
export default function Sidebar({ isOpen = false, onClose }) {
  const { data: session, status } = useSession();
  const { isDark } = useThemeContext();
  const pathname = usePathname(); // trigger rerender & refresh list on route changes
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(true);

  const handleNavigate = () => {
    if (typeof onClose === "function" && typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };
  const navLinks = [
    { href: "/dashboard/convert", label: "Upload Data", icon: FiUploadCloud },
    // Tambahkan link lain di sini jika perlu
    // { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  ];

  useEffect(() => {
    let active = true;

    const loadRecent = async () => {
      setIsLoadingAnalyses(true);
      try {
        const response = await fetch("/api/analysis?limit=5");
        if (!response.ok) {
          throw new Error("Failed to load");
        }
        const data = await response.json();
        if (!active) return;
        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          id: item.id,
          title: item.sourceFile || "Tanpa Judul",
          href: `/dashboard/analysis/${item.id}`,
        }));
        setRecentAnalyses(mapped);
      } catch (err) {
        if (active) {
          setRecentAnalyses([]);
        }
      } finally {
        if (active) {
          setIsLoadingAnalyses(false);
        }
      }
    };

    loadRecent();

    return () => {
      active = false;
    };
  }, [pathname]);

  const sidebarShell = isDark ? "border-slate-800 bg-slate-900 text-slate-100" : "border-slate-200 bg-white text-slate-900";

  const translateClass = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r ${sidebarShell} transform transition-transform duration-300 lg:translate-x-0 lg:transition-none ${translateClass}`}
      aria-hidden={!isOpen}
    >
      {/* 1. Logo/Judul Aplikasi */}
      <div className={`flex h-16 shrink-0 items-center justify-between border-b px-6 transition-colors duration-300 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
        <Link href="/dashboard/convert" className="flex items-center gap-2">
          {/* Ganti dengan logo Anda jika ada */}
          <span className={`text-xl font-bold transition-colors ${isDark ? "text-sky-500" : "text-sky-600"}`}>DevLens</span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup navigasi"
          className={`rounded-md p-2 transition-colors lg:hidden ${isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}
        >
          <FiX className="h-5 w-5" />
        </button>
      </div>

      {/* 2. Area Navigasi (Bisa di-scroll jika link banyak) */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} icon={link.icon} isDark={isDark} onNavigate={handleNavigate}>
              {link.label}
            </NavLink>
          ))}
          <AnalysisNav items={recentAnalyses} isDark={isDark} isLoading={isLoadingAnalyses} onNavigate={handleNavigate} />
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
