import { NextResponse } from "next/server";
import { hash } from "bcrypt"; // Impor mesin enkripsi kita
import { prisma } from "@/lib/prisma"; // Impor koneksi database

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 1. Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      // "Jika email sudah ada, tolak pendaftaran"
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    }

    // 2. Enkripsi password
    // "Ambil password (misal: '123456') dan acak menjadi hash (misal: '$2b...')"
    const hashedPassword = await hash(password, 10);

    // 3. Simpan pengguna baru ke database
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword, // "Simpan password yang sudah di-enkripsi"
      },
    });

    // "Kirim balasan sukses"
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
