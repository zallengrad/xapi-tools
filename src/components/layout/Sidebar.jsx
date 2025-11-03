"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useThemeContext } from "@/context/theme/ThemeContext";
import {
  FiGrid,
  FiUploadCloud,
  FiBarChart2,
  FiLogOut,
  FiUser, // Fallback icon
  FiLoader, // Loading icon
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

// Komponen Sidebar Utama
export default function Sidebar() {
  const { data: session, status } = useSession();
  const { isDark } = useThemeContext();

  const navLinks = [
    { href: "/dashboard/convert", label: "Upload Data", icon: FiUploadCloud },
    { href: "/dashboard/analysis", label: "Hasil Analisis", icon: FiBarChart2 },
    // Tambahkan link lain di sini jika perlu
    // { href: "/dashboard", label: "Dashboard", icon: FiGrid },
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
