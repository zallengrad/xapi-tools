"use client";

// Suspense diperlukan untuk "menunggu" komponen ResetForm membaca token dari URL
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useThemeContext } from "../../context/theme/ThemeContext";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { FiEye, FiEyeOff } from "react-icons/fi";

// =================================================================
// == KOMPONEN FORM (Logika Inti) ==
// =================================================================
// Kita buat komponen terpisah agar bisa dibungkus <Suspense>
function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // "Alat untuk membaca URL"
  const token = searchParams.get("token"); // "Ambil 'Kunci Tamu' (token) dari URL"

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ini adalah "Petugas Pengganti Kunci" yang akan kita panggil
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Password dan Konfirmasi Password tidak cocok.");
      return;
    }
    if (!token) {
      setError("Token reset tidak ditemukan. Silakan minta link baru.");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message + " Mengarahkan ke halaman login...");
        // Arahkan ke /login setelah 3 detik
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
    }
    setIsLoading(false);
  };

  // Logika tema (diambil dari 'isDark' di komponen induk)
  const { isDark } = useThemeContext();
  const theme = isDark
    ? {
        subtitle: "text-slate-400",
        input: "bg-slate-700 border-slate-600 text-white",
      }
    : {
        subtitle: "text-slate-500",
        input: "bg-white border-slate-300 text-slate-900",
      };

  return (
    <>
      {message && <div className="mb-4 rounded-md border border-green-300 bg-green-100 p-3 text-center text-sm font-medium text-green-800 dark:border-green-700 dark:bg-green-900/50 dark:text-green-300">{message}</div>}
      {error && <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-center text-sm font-medium text-red-800 dark:border-red-700 dark:bg-red-900/50 dark:text-red-300">{error}</div>}

      {/* Jika sudah sukses, sembunyikan form */}
      {!message && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Password Baru */}
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${theme.subtitle}`}>
              Password Baru
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${theme.input} pr-10`}
                placeholder="Minimal 6 karakter"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute inset-y-0 right-0 flex items-center pr-3 ${theme.subtitle} hover:text-sky-500 focus:outline-none`}>
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Input Konfirmasi Password */}
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium ${theme.subtitle}`}>
              Konfirmasi Password Baru
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${theme.input}`}
              placeholder="Ulangi password baru"
            />
          </div>

          <button type="submit" disabled={isLoading} className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50">
            {isLoading ? "Menyimpan..." : "Reset Password Saya"}
          </button>
        </form>
      )}
    </>
  );
}

// =================================================================
// == KOMPONEN HALAMAN (Pembungkus) ==
// =================================================================
// Ini adalah halaman yang sebenarnya di-render
export default function ResetPasswordPage() {
  const { isDark, toggle, ready } = useThemeContext();

  const theme = isDark
    ? {
        main: "bg-slate-900 text-slate-100",
        card: "bg-slate-800 border-slate-700",
        heading: "text-white",
        subtitle: "text-slate-400",
      }
    : {
        main: "bg-slate-50 text-slate-900",
        card: "bg-white border-slate-200",
        heading: "text-slate-800",
        subtitle: "text-slate-500",
      };

  return (
    <main className={`flex min-h-screen w-full flex-col items-center justify-center p-4 ${theme.main}`}>
      {ready && <ThemeToggle isDark={isDark} onToggle={toggle} className="absolute top-4 right-4" />}
      <div className="w-full max-w-md">
        <div className={`shadow-sm rounded-xl border p-8 ${theme.card}`}>
          <h1 className={`text-2xl font-bold text-center ${theme.heading}`}>Buat Password Baru</h1>
          <p className={`mt-2 text-sm text-center ${theme.subtitle}`}>Masukkan password baru Anda di bawah ini.</p>

          <div className="mt-6">
            {/* Kita bungkus Form-nya dengan <Suspense> */}
            {/* Ini akan "menunggu" form-nya selesai membaca token dari URL */}
            <Suspense fallback={<div className="text-center">Memuat...</div>}>
              <ResetForm />
            </Suspense>
          </div>
        </div>
        <p className={`mt-4 text-center text-sm ${theme.subtitle}`}>
          Ingat password Anda?{" "}
          <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-400">
            Kembali ke Login
          </Link>
        </p>
      </div>
    </main>
  );
}
