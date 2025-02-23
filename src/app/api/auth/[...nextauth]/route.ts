// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  // Indique o "secret" para encriptação dos tokens JWT
  secret: process.env.NEXTAUTH_SECRET,

  // Adaptador do Prisma (para ler/escrever dados de usuários, etc.)
  adapter: PrismaAdapter(prisma),

  // Provider "Credentials" para login com email/senha
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "exemplo@dominio.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "********",
        },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas.");
        }

        const { email, password } = credentials;

        // 1) Buscar o usuário no banco
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        // 2) Verificar a senha (comparar com a hash no BD)
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
          throw new Error("Senha incorreta.");
        }

        // 3) Tudo certo: retorne dados do user para o token/sessão
        return { id: user.id, email: user.email };
      },
    }),
  ],

  // Usar tokens JWT (em vez de sessions no banco).
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Gerado/atualizado o JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Quando "useSession" é chamado
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // pages (opcional): customizar rotas de signIn, signOut, error, etc.
  // pages: {
  //   signIn: "/(admin)/login", // Rota da sua página de login
  //   error: "/(admin)/login",
  // },

  // Logs de debug do NextAuth no modo dev (opcional)
  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
