// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  // Adaptador do Prisma (para ler/escrever dados de usuários, sessões, etc.)
  adapter: PrismaAdapter(prisma),

  // Definindo o provider "Credentials", para login com email/senha
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
        // 1) Validar se as credenciais existem
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas.");
        }

        const { email, password } = credentials;

        // 2) Buscar o usuário no banco pelo email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        // 3) Verificar a senha (comparar com a hash do BD)
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
          throw new Error("Senha incorreta.");
        }

        // Se deu tudo certo, retorna objeto com dados que vão para o token/sessão
        return { id: user.id, email: user.email };
      },
    }),
  ],

  // Usar tokens JWT (em vez de sessions salvas no banco).
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Toda vez que o JWT é criado/atualizado
    async jwt({ token, user }) {
      // Se 'user' existir, significa que é a primeira vez (login)
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Toda vez que "useSession" (ou getServerSession) é chamado no cliente/servidor
    async session({ session, token }) {
      // Se tivermos um token, incluir o ID do user no session
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // (Opcional) para customizar rotas de signIn, signOut, error, etc.
  // pages: {
  //   signIn: "/(admin)/login",
  //   error: "/(admin)/login",
  // },

  // Opcional: Ativar logs do NextAuth em modo dev
  // debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
