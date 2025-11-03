"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FiGrid,
  FiUploadCloud,
  FiBarChart2,
  FiLogOut,
  FiUser, // Fallback icon
  FiLoader, // Loading icon
} from "react-icons/fi";

// Komponen internal untuk satu item link navigasi
function NavLink({ href, icon: Icon, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const activeClass = "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300";
  const inactiveClass = "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800";

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

  const navLinks = [
    { href: "/convert", label: "Upload Data", icon: FiUploadCloud },
    { href: "/analysis", label: "Hasil Analisis", icon: FiBarChart2 },
    // Tambahkan link lain di sini jika perlu
    // { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  ];

  return (
    <aside className="fixed left-0 top-0 flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      {/* 1. Logo/Judul Aplikasi */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-6 dark:border-slate-800">
        <Link href="/convert" className="flex items-center gap-2">
          {/* Ganti dengan logo Anda jika ada */}
          <span className="text-xl font-bold text-sky-600 dark:text-sky-500">DevLens</span>
        </Link>
      </div>

      {/* 2. Area Navigasi (Bisa di-scroll jika link banyak) */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} icon={link.icon}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* 3. Area User & Logout (di bawah) */}
      <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
        {status === "loading" && (
          <div className="flex items-center gap-3">
            <FiLoader className="h-9 w-9 animate-spin text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Memuat...</p>
            </div>
          </div>
        )}

        {status === "authenticated" && session?.user && (
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <Image src={session.user.image} alt={session.user.name || "Avatar"} width={36} height={36} className="rounded-full" />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                <FiUser className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </span>
            )}
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{session.user.name || "Pengguna"}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Logout"
              className="ml-2 rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
