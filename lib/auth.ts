import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserRecord from "@/models/Record";

// ✅ لازم يطابق User في next-auth.d.ts: groupid = number فقط
type AppUser = {
  id: string;
  name: string;
  groupid: number;
};

function isAppUser(u: unknown): u is AppUser {
  if (!u || typeof u !== "object") return false;
  const obj = u as globalThis.Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.groupid === "number"
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        user: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.user || !credentials?.password) return null;

        const found = await UserRecord.findOne({ user: credentials.user });
        if (!found) return null;

        if (found.password !== credentials.password) return null;

        // ✅ تحويل groupid إلى number قبل الإرجاع (حل المشكلة)
        const user: AppUser = {
          id: found._id.toString(),
          name: found.user,
          groupid: Number(found.groupid),
        };

        // لو تحول إلى NaN اعتبره فشل تسجيل
        if (!Number.isFinite(user.groupid)) return null;

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user && isAppUser(user)) {
        token.id = user.id;
        token.name = user.name;
        token.groupid = user.groupid; // ✅ صار رقم بالفعل
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = typeof token.id === "string" ? token.id : "";

      const gid = (token as JWT).groupid;
      session.user.groupid = typeof gid === "number" ? gid : 0;

      if (typeof token.name === "string") {
        session.user.name = token.name;
      }

      return session;
    },
  },

  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});
