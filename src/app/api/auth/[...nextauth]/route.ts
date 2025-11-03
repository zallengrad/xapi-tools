import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; //
import GithubProvider from "next-auth/providers/github";

// --- PERUBAHAN DI SINI ---
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
// -------------------------

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),

    // --- INI "PINTU MASUK" BARU YANG KITA TAMBAHKAN ---
    CredentialsProvider({
      // Ini adalah 'id' internal untuk provider ini
      id: "credentials",
      // Ini nama yang akan muncul di halaman login (jika kita buat otomatis)
      name: "Email & Password",

      // Ini adalah instruksi untuk "Manajer Keamanan" (NextAuth)
      // tentang cara memvalidasi pengguna
      async authorize(credentials) {
        // 'credentials' berisi { email: '...', password: '...' }
        // yang dikirim dari formulir login

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        // 1. "Cari pengguna di Laci 'User' berdasarkan email"
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 2. "Jika pengguna tidak ada, atau dia tidak punya password
        //    (mungkin dia daftar via GitHub), tolak login."
        if (!user || !user.hashedPassword) {
          throw new Error("Email tidak terdaftar atau password tidak valid");
        }

        // 3. "Bandingkan password dari formulir dengan password enkripsi di database"
        const isPasswordValid = await compare(
          credentials.password, // Password dari formulir (misal: '123456')
          user.hashedPassword // Password enkripsi (misal: '$2b...')
        );

        // 4. "Jika password tidak cocok, tolak login"
        if (!isPasswordValid) {
          throw new Error("Email tidak terdaftar atau password tidak valid");
        }

        // 5. "Jika semua cocok, izinkan login dengan mengembalikan data user"
        return user;
      },
    }),
    // -------------------------------------------------
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 60 detik * 60 menit = 3600 detik (1 jam)
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // --- KITA TAMBAHKAN INI ---
  // Memberi tahu NextAuth halaman login kustom kita (nanti kita buat)
  pages: {
    signIn: "/login", // Jika login gagal atau perlu login, arahkan ke halaman /login
  },
  // -------------------------
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
