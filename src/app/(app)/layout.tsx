import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
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

  const userName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.email as string | undefined) ??
    "사용자";
  const userAvatar = user.user_metadata?.avatar_url as string | undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={userName}
        userAvatar={userAvatar}
        isAdmin={isAdminEmail(user.email)}
      />
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  );
}
