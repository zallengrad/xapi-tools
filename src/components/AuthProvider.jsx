// "use client" memberitahu Next.js bahwa ini adalah komponen
// yang berjalan di "browser" (sisi klien), bukan di server.
"use client";

// Kita impor "Sistem Interkom" utamanya dari NextAuth
import { SessionProvider } from "next-auth/react";

/**
 * Ini adalah komponen pembungkus kita.
 * Dia akan menerima 'children' (yaitu seluruh halaman aplikasi Anda)
 * dan membungkusnya dengan 'SessionProvider'.
 */
export default function AuthProvider({ children }) {
  // 'SessionProvider' inilah yang akan memantau status login
  // dan memberitahukannya ke semua halaman di dalamnya.
  return <SessionProvider>{children}</SessionProvider>;
}
