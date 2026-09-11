"use client";

import { useActionState } from "react";
import { LogIn, ShieldAlert } from "lucide-react";
import { loginAction, type LoginState } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="mt-8 space-y-4">
      {state.error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
          <ShieldAlert size={17} className="mt-0.5 shrink-0" />
          {state.error}
        </div>
      )}
      <Field label="Correo electrónico">
        <Input name="email" type="email" placeholder="tucorreo@ejemplo.com" required autoComplete="email" />
      </Field>
      <Field label="Contraseña">
        <Input name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
      </Field>
      <Button type="submit" className="w-full" size="lg" loading={pending}>
        {!pending && <LogIn size={17} />}
        {pending ? "Verificando…" : "Ingresar"}
      </Button>
    </form>
  );
}
