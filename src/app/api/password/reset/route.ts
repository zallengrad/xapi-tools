import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; //
import { hash } from "bcrypt"; // "Mesin Enkripsi"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // 1. "Cari 'Kunci Tamu' (token) di Laci VerificationToken"
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { token: token },
    });

    // 2. "Jika kuncinya tidak ada, atau sudah dipakai, tolak!"
    if (!tokenRecord) {
      return NextResponse.json({ error: "Token tidak valid." }, { status: 400 });
    }

    // 3. "Jika kuncinya sudah hangus (expired), tolak!"
    if (tokenRecord.expires < new Date()) {
      return NextResponse.json({ error: "Token sudah hangus." }, { status: 400 });
    }

    // 4. "Ambil password baru dan masukkan ke 'Mesin Enkripsi'"
    const hashedPassword = await hash(password, 10);

    // 5. "Cari pengguna yang memiliki token ini (berdasarkan email)
    //    dan ganti 'Kunci Permanen' (hashedPassword) dia."
    await prisma.user.update({
      where: { email: tokenRecord.identifier },
      data: {
        hashedPassword: hashedPassword,
      },
    }); //

    // 6. PENTING! "Hancurkan 'Kunci Tamu' agar tidak bisa dipakai lagi."
    await prisma.verificationToken.delete({
      where: { token: token },
    }); //

    return NextResponse.json({ message: "Password berhasil direset!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Terjadi kesalahan internal" }, { status: 500 });
  }
}
