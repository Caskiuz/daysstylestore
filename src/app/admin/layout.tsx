import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/shell";
import { checkDbReady } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/trabajadora");

  const dbReady = await checkDbReady();

  return (
    <AdminShell userName={session.name} dbReady={dbReady}>
      {children}
    </AdminShell>
  );
}
