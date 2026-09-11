"use server";

import { redirect } from "next/navigation";
import { verifyCredentials, createSession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "Ingresa tu correo y contraseña." };

  let user;
  try {
    user = await verifyCredentials(email, password);
  } catch {
    return { error: "No hay conexión con la base de datos. Configura DATABASE_URL (ver README) e intenta de nuevo." };
  }
  if (!user) return { error: "Correo o contraseña incorrectos." };

  await createSession(user);
  redirect(user.role === "ADMIN" ? "/admin" : "/trabajadora");
}
