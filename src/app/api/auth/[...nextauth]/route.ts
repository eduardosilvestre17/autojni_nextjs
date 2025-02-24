import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  // Secret para encriptação dos tokens (deve estar definida em .env)
  secret: process.env.NEXTAUTH_SECRET,

  // Adapter para conectar com o Prisma
  adapter: PrismaAdapter(prisma),

  // Provedores de autenticação
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@exemplo.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas.");
        }
        const { email, password } = credentials;

        // Procura o usuário pelo email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        // Verifica se a senha está correta
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
          throw new Error("Senha incorreta.");
        }

        // Retorna os dados do usuário (garantindo que o id seja uma string)
        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],

  // Configuração de sessão utilizando JWT
  session: {
    strategy: "jwt",
  },

  // Configuração do JWT (você pode adicionar opções, se necessário)
  jwt: {
    // Exemplo: maxAge: 30 * 24 * 60 * 60, // 30 dias
  },

  /**
   * Sobrescrevemos os cookies para remover propriedades de expiração,
   * fazendo com que o cookie seja apenas de sessão.
   */
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  // Callbacks para incluir informações customizadas no token e na sessão
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  // Ativa logs detalhados em desenvolvimento
  debug: process.env.NODE_ENV === "development",
});

// Exporta o handler para os métodos GET e POST
export { handler as GET, handler as POST };
