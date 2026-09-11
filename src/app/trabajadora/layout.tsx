import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { checkDbReady } from "@/lib/admin-data";
import { WorkerShell } from "@/components/worker/shell";

export const dynamic = "force-dynamic";

export default async function TrabajadoraLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "WORKER" || !session.workerId) redirect("/admin");

  const dbReady = await checkDbReady();

  return (
    <WorkerShell userName={session.name} workerCode={session.workerCode ?? ""} dbReady={dbReady}>
      {children}
    </WorkerShell>
  );
}
