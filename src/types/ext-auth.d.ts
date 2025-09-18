// /src/types/next-auth.d.ts
import "next-auth";
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      agencyId?: string | null;
    };
  }

  interface User extends DefaultUser {
    role: string;
    agencyId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    agencyId?: string | null;
  }
}

// Additional types for AdapterUser if needed
declare module "next-auth/adapters" {
  interface AdapterUser {
    id: string;
    email: string;
    emailVerified: Date | null;
  }
}