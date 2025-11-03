"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useThemeContext } from "../../context/theme/ThemeContext";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Komponen kecil untuk menampilkan pesan sukses setelah register
function RegisterSuccessMessage() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  if (registered === "true") {
    return <div className="mb-4 rounded-md border border-green-300 bg-green-100 p-3 text-center text-sm font-medium text-green-800 dark:border-green-700 dark:bg-green-900/50 dark:text-green-300">Pendaftaran berhasil! Silakan login.</div>;
  }
  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const { isDark, toggle, ready } = useThemeContext();

  // State untuk menyimpan inputan form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi yang dipanggil saat tombol "Login" manual diklik
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Bersihkan error lama

    // Ini adalah cara memanggil "Manajer Keamanan" (NextAuth)
    // untuk Pintu Masuk "credentials" (Email/Password)
    const result = await signIn("credentials", {
      redirect: false, // Penting! Jangan refresh halaman
      email: email,
      password: password,
    });

    setIsLoading(false);

    if (result.ok) {
      // Jika login sukses, arahkan ke halaman utama
      router.push("/dashboard/convert"); // Atau bisa juga ke /analysis
    } else {
      // Jika gagal, tampilkan pesan error dari NextAuth
      setError(result.error || "Email atau password salah.");
    }
  };

  // Fungsi untuk login via "KTP Tamu" (GitHub)
  const handleGithubSignIn = () => {
    setIsLoading(true);
    signIn("github", { callbackUrl: "/dashboard/convert" });
  };

  // Logika tema (gelap/terang)
  const theme = isDark
    ? {
        main: "bg-slate-900 text-slate-100",
        card: "bg-slate-800 border-slate-700",
        heading: "text-white",
        subtitle: "text-slate-400",
        input: "bg-slate-700 border-slate-600 text-white placeholder-slate-400",
      }
    : {
        main: "bg-slate-50 text-slate-900",
        card: "bg-white border-slate-200",
        heading: "text-slate-800",
        subtitle: "text-slate-500",
        input: "bg-white border-slate-300 text-slate-900 placeholder-slate-400",
      };

  return (
    <main className={`flex min-h-screen w-full flex-col items-center justify-center p-4 ${theme.main}`}>
      {ready && <ThemeToggle isDark={isDark} onToggle={toggle} className="absolute top-4 right-4" />}
      <div className="w-full max-w-md">
        <div className={`shadow-sm rounded-xl border p-8 transition-colors ${theme.card}`}>
          <h1 className={`text-2xl font-bold text-center ${theme.heading}`}>Selamat Datang Kembali</h1>
          <p className={`mt-2 text-sm text-center ${theme.subtitle}`}>Silakan login untuk melanjutkan ke DevLens.</p>

          <div className="mt-6">
            {/* Suspense diperlukan karena RegisterSuccessMessage 
              menggunakan useSearchParams() 
            */}
            <Suspense fallback={null}>
              <RegisterSuccessMessage />
            </Suspense>

            {error && <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-center text-sm font-medium text-red-800 dark:border-red-700 dark:bg-red-900/50 dark:text-red-300">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${theme.subtitle}`}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${theme.input}`}
                  placeholder="yourmail@mail.com"
                />
              </div>
              {/* GANTI DIV PASSWORD LAMA DENGAN INI */}
              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${theme.subtitle}`}>
                  Password
                </label>
                {/* 1. Bungkus input dan tombol dengan div 'relative' */}
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    // 2. Ubah 'type' menjadi dinamis (berubah-ubah)
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // 3. Tambahkan padding kanan (pr-10) agar teks tidak tertimpa ikon
                    className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${theme.input} pr-10`}
                    placeholder="••••••••"
                  />
                  {/* 4. Tombol Ikon Mata */}
                  <button
                    type="button" // 'type="button"' agar tidak men-submit form
                    onClick={() => setShowPassword(!showPassword)} // 'Toggle' state saat diklik
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${theme.subtitle} hover:text-sky-500 focus:outline-none`}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {/* 5. Ganti ikon berdasarkan state */}
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              {/* AKHIR BLOK PENGGANTI */}
              <div className="text-left">
                <Link href="/forgot-password" className={`text-sm font-medium text-sky-500 hover:text-sky-400 ${theme.subtitle}`}>
                  Lupa password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Login"}
              </button>
            </form>

            <div className="my-6 flex items-center justify-center">
              <span className={`text-xs ${theme.subtitle}`}>ATAU</span>
            </div>

            <button
              onClick={handleGithubSignIn}
              disabled={isLoading}
              className={`w-full rounded-md border px-4 py-2 text-sm font-semibold shadow-sm transition-colors disabled:opacity-50 ${
                isDark ? "border-slate-600 bg-slate-700 text-white hover:bg-slate-600" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Login dengan GitHub
            </button>
          </div>
        </div>
        <p className={`mt-4 text-center text-sm ${theme.subtitle}`}>
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-sky-500 hover:text-sky-400">
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
