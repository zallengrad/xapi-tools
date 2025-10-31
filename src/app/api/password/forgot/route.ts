import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; //
import nodemailer from "nodemailer";
import crypto from "crypto"; // Alat pembuat token acak (bawaan Node.js)

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 1. Cari pengguna di database
    const user = await prisma.user.findUnique({
      where: { email },
    }); //

    // PENTING: Jangan beri tahu penyerang jika emailnya ada atau tidak.
    // Selalu kirim respons sukses, meskipun email tidak ditemukan.
    if (!user) {
      return NextResponse.json({ message: "Jika email terdaftar, link reset akan dikirim." }, { status: 200 });
    }

    // 2. Buat "Kunci Tamu" (Token)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(new Date().getTime() + 60 * 60 * 1000); // Beri waktu 1 jam

    // 3. Simpan "Kunci Tamu" ke "Laci VerificationToken"
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: token,
        expires: expires,
      },
    }); //

    // 4. Siapkan "Tukang Pos" (Nodemailer)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // 5. Kirim email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset Password Akun DevLens Anda",
      html: `
        <p>Halo,</p>
        <p>Anda meminta untuk reset password. Klik link di bawah untuk melanjutkan:</p>
        <a href="${resetLink}">Reset Password Saya</a>
        <p>Link ini akan hangus dalam 1 jam.</p>
        <p>Jika Anda tidak meminta ini, abaikan saja email ini.</p>
      `,
    });

    return NextResponse.json({ message: "Jika email terdaftar, link reset akan dikirim." }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
