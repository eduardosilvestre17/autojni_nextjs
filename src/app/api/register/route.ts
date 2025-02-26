/* ficheiro para criar utilizadores, apenas remover comentário quando se for criar um,
voltar a colocar comentario apos isso!


import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// Ajuste o caminho do prisma conforme sua estrutura
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const email = "admin@teste.com";
    const password = "1234";

    // Verifica se o usuário já existe
    const existing = await prisma.user.findUnique({ where: { email } });

    // Se existir, atualiza ou simplesmente retorna mensagem
    if (existing) {
      return NextResponse.json({
        message: "O usuário admin@teste.com já existe no banco de dados.",
        user: existing,
      });
    }

    // Se não existir, cria com a senha "1234"
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: "Usuário criado com sucesso.",
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

*/
