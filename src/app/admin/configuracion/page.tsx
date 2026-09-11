import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/settings-form";
import type { SettingsInput } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const s = await getSettings();
  // Asegurar el registro de configuración en la base de datos
  if (!s.demo) {
    await prisma.setting.upsert({ where: { id: "main" }, update: {}, create: { id: "main", paymentMethods: s.paymentMethods } }).catch(() => {});
  }

  const initial: SettingsInput = {
    storeName: s.storeName,
    tagline: s.tagline,
    whatsapp: s.whatsapp,
    instagram: s.instagram,
    facebook: s.facebook,
    tiktok: s.tiktok,
    email: s.email,
    address: s.address,
    aboutText: s.aboutText,
    aiPrompt: s.aiPrompt,
    aiEnabled: s.aiEnabled,
    usdToCop: s.usdToCop,
    usdToVes: s.usdToVes,
    currenciesEnabled: s.currenciesEnabled,
    paymentMethods: s.paymentMethods,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold">Configuración</h1>
        <p className="text-sm text-muted-foreground">Datos del negocio, monedas, pagos y asistente IA</p>
      </div>
      <SettingsForm initial={initial} />
    </div>
  );
}
