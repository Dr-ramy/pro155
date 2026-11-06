import NextAuth, { type DefaultSession, type DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      groupid: number;
    };
  }

  interface User extends DefaultUser {
    id: string;
    groupid: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    groupid?: number;
  }
}
