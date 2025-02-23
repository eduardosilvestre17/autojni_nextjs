import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas.");
        }
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("Usuário não encontrado.");
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
          throw new Error("Senha incorreta.");
        }

        // Convertendo o ID para string, caso ele seja inteiro no banco:
        return {
          id: user.id.toString(),
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  jwt: {
    // Sem maxAge => não gera expiração fixa
  },

  /**
   * 4) Sobrescrevemos os cookies para remover qualquer 'expires'
   *    ou 'maxAge'. Isso faz com que o cookie seja de sessão.
   *    No momento em que o usuário fecha o navegador, o cookie some.
   */
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        // NUNCA colocar expires ou maxAge aqui
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    // Se quiser sobrescrever também callbackUrl, csrfToken, etc., faça igual
    // callbackUrl: { ... },
    // csrfToken: { ... },
  },

  callbacks: {
    async jwt({ token, user }) {
      // Passa o user.id para o token na primeira vez.
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Garantindo que session.user.id seja igual ao token.id
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
