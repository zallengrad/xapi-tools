"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useThemeContext } from "../../context/theme/ThemeContext";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const { isDark, toggle, ready } = useThemeContext();

  // State untuk form pendaftaran
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi yang dipanggil saat tombol "Daftar" diklik
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Kita panggil "Kantor Pendaftaran" (API Register)
    // yang sudah kita buat sebelumnya
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Jika sukses, arahkan ke halaman Login
        // dengan membawa pesan "registered=true"
        router.push("/login?registered=true");
      } else {
        // Jika gagal (misal: email sudah ada)
        const data = await response.json();
        setError(data.error || "Pendaftaran gagal.");
      }
    } catch (err) {
      setError("Terjadi kesalahan. Coba lagi nanti.");
    }

    setIsLoading(false);
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
          <h1 className={`text-2xl font-bold text-center ${theme.heading}`}>Buat Akun Baru</h1>
          <p className={`mt-2 text-sm text-center ${theme.subtitle}`}>Mulai analisis pola koding Anda hari ini.</p>

          <div className="mt-6">
            {error && <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-center text-sm font-medium text-red-800 dark:border-red-700 dark:bg-red-900/50 dark:text-red-300">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium ${theme.subtitle}`}>
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${theme.input}`}
                  placeholder="Nama Anda"
                />
              </div>
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
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${theme.input} pr-10`}
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${theme.subtitle} hover:text-sky-500 focus:outline-none`}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>
              {/* AKHIR BLOK PENGGANTI */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:opacity-50"
              >
                {isLoading ? "Mendaftarkan..." : "Daftar Akun Baru"}
              </button>
            </form>
          </div>
        </div>
        <p className={`mt-4 text-center text-sm ${theme.subtitle}`}>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-400">
            Login di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
