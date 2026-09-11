import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { ChatWidget } from "@/components/ai/chat-widget";
import { getSettings } from "@/lib/data";
import { getSession } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, session] = await Promise.all([getSettings(), getSession()]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar whatsapp={settings.whatsapp} session={session} demo={settings.demo} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp whatsapp={settings.whatsapp} storeName={settings.storeName} />
      <ChatWidget />
    </div>
  );
}
