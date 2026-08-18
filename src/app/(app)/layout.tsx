import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { getViewerProfile } from "@/lib/profile";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import Navbar from "@/components/Navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    redirect("/login");
  }

  const [{ displayName, avatarUrl }, locale] = await Promise.all([
    getViewerProfile(supabase, user),
    getLocale(),
  ]);
  const dict = getDictionary(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={displayName}
        userAvatar={avatarUrl}
        isAdmin={isAdminEmail(user.email)}
        locale={locale}
        dict={dict}
      />
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
