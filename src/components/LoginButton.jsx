"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useThemeContext } from "../context/theme/ThemeContext";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const { isDark } = useThemeContext();
  const themed = (lightClass, darkClass) => (isDark ? darkClass : lightClass);

  if (status === "loading") {
    return <div className="text-sm text-slate-400">Memeriksa...</div>;
  }

  // Bagian ini masih sama: Tampilkan info jika sudah login
  if (status === "authenticated") {
    return (
      <div className="flex items-center gap-3">
        {session.user.image && <Image src={session.user.image} alt={session.user.name ?? "Foto Profil"} width={32} height={32} className="rounded-full" />}
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${themed(
            "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900",
            "border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white"
          )}`}
        >
          Logout
        </button>
      </div>
    );
  }

  // --- BAGIAN INI BERUBAH ---
  // Sekarang kita tampilkan Link ke halaman /login
  return (
    <Link
      href="/login"
      className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${themed(
        "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900",
        "border-slate-700 text-slate-200 hover:border-slate-500 hover:text-white"
      )}`}
    >
      Login / Daftar
    </Link>
  );
}
