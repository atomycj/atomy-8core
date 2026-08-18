import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { getViewerProfile } from "@/lib/profile";
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

  const { displayName, avatarUrl } = await getViewerProfile(supabase, user);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={displayName}
        userAvatar={avatarUrl}
        isAdmin={isAdminEmail(user.email)}
      />
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
