// Impor fungsi "Satpam" dari NextAuth
import { withAuth } from "next-auth/middleware";

// ===============================================
// == BAGIAN 1: LOGIKA SATPAM (Apa yang dilakukan) ==
// ===============================================
export default withAuth(
  // Fungsi ini menentukan APA YANG DILAKUKAN si Satpam
  function middleware(req) {
    // Fungsi ini sebenarnya bisa kosong!
    // Logika "punya Kartu Akses atau tidak" sudah
    // otomatis ditangani oleh 'withAuth'.
  },
  {
    // Opsi ini memberi tahu 'withAuth' cara kerja 'Satpam'
    callbacks: {
      // "Kapan seorang tamu dianggap 'Resmi' (authorized)?"
      authorized: ({ token, req }) => {
        // Jika menggunakan JWT session, NextAuth memberikan 'token'
        if (token) return true;
        // Jika menggunakan session berbasis database, token akan null,
        // jadi kita cek apakah ada session user yang valid.
        return !!req?.nextauth?.session?.user;
      },
    },
    // "Jika tamu tidak resmi, antar dia ke 'Lobi' ini"
    pages: {
      signIn: "/login", // Ini cocok dengan yang di 'authOptions'/route.ts]
    },
  }
);

// ===================================================
// == BAGIAN 2: BUKU ATURAN SATPAM (Di mana berjaga) ==
// ===================================================
export const config = {
  // 'matcher' adalah daftar halaman di mana 'Satpam' ini akan berjaga.
  // Ini adalah bagian paling canggih:
  matcher: [
    /*
     * Cocokkan semua jalur permintaan, KECUALI:
     * - / (Halaman Teras / Landing Page)
     * - /login (Halaman Lobi)
     * - /register (Halaman Pendaftaran)
     * - /api/ (Jalur internal untuk API)
     * - /_next/static (File statis Next.js)
     * - /_next/image (File gambar Next.js)
     * - /favicon.ico (File ikon)
     * - (file publik lainnya seperti .svg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password|$).*)",

    // Namun, kita tambahkan juga halaman-halaman yang PASTI mau kita jaga
    // (walaupun regex di atas sudah mencakupnya, ini untuk keamanan ganda)
    "/convert",
    "/analysis",
    "/analysis/:path*", // Melindungi /analysis/123, /analysis/abc, dst.
  ],
};
