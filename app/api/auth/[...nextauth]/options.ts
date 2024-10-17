import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Role } from "../../../../enums/user/role";
// import { RoleType } from "@prisma/client";

// REF.: https://next-auth.js.org/configuration/providers/oauth#using-a-custom-provider
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60 * 3, // 3 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        console.log(">>>>>profile", profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified,
          image: profile.picture,
          role: profile.role ? profile.role : Role.INVESTOR,
        };
      },
    }),
  ],
  // REF.: https://authjs.dev/guides/role-based-access-control#with-database
  callbacks: {
    async jwt({ token, user }) {
      token.role = user?.role ?? Role.INVESTOR;
      const userData = {
        user: {
          role: user?.role ?? '',
          id: user?.id ?? '',
        },
      };
      return { ...token, ...userData };
    },
    async session({ session, token, user }) {
      session.user.role = String(token?.role ?? user?.role ?? '');
      session.user.id = String(token?.id ?? user?.id ?? '');
      console.log("SESION", session);
      return session;
    },
  },
};
