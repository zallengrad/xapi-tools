"use client";

import { useState } from "react";
import Link from "next/link";
import { useThemeContext } from "../../context/theme/ThemeContext";
import ThemeToggle from "../../components/ui/ThemeToggle";

export default function ForgotPasswordPage() {
  const { isDark, toggle, ready } = useThemeContext();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Gagal terhubung ke server.");
    }
    setIsLoading(false);
  };

  // Logika tema (sama seperti login/register)
  const theme = isDark
    ? {
        main: "bg-slate-900 text-slate-100",
        card: "bg-slate-800 border-slate-700",
        heading: "text-white",
        subtitle: "text-slate-400",
        input: "bg-slate-700 border-slate-600 text-white",
      }
    : {
        main: "bg-slate-50 text-slate-900",
        card: "bg-white border-slate-200",
        heading: "text-slate-800",
        subtitle: "text-slate-500",
        input: "bg-white border-slate-300 text-slate-900",
      };

  return (
    <main className={`flex min-h-screen w-full flex-col items-center justify-center p-4 ${theme.main}`}>
      {ready && <ThemeToggle isDark={isDark} onToggle={toggle} className="absolute top-4 right-4" />}
      <div className="w-full max-w-md">
        <div className={`shadow-sm rounded-xl border p-8 ${theme.card}`}>
          <h1 className={`text-2xl font-bold text-center ${theme.heading}`}>Lupa Password?</h1>
          <p className={`mt-2 text-sm text-center ${theme.subtitle}`}>Masukkan email Anda. Jika terdaftar, kami akan mengirim link untuk reset password.</p>

          <div className="mt-6">
            {message && <div className="mb-4 rounded-md border border-green-300 bg-green-100 p-3 text-center text-sm font-medium text-green-800 dark:border-green-700 dark:bg-green-900/50 dark:text-green-300">{message}</div>}
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
                  placeholder="anda@email.com"
                />
              </div>
              <button type="submit" disabled={isLoading} className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 disabled:opacity-50">
                {isLoading ? "Mengirim..." : "Kirim Link Reset"}
              </button>
            </form>
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
