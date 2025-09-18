// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Body received:", body);

    const email = body.email?.trim();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    console.log("Comparing passwords...");
    console.log("Provided password:", password);
    console.log("Stored hash:", user.password);

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Valid?", validPassword);

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", userId: user.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

