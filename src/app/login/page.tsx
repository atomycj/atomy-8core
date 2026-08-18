import Image from "next/image";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import LanguageToggle from "@/components/LanguageToggle";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default async function LoginPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-orange-50 to-white px-4">
      <div className="w-full max-w-sm rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <LanguageToggle locale={locale} />
        </div>
        <div className="mx-auto mb-4 flex justify-center">
          <Image
            src="/logo-nav.png"
            alt={dict.appName}
            width={266}
            height={160}
            priority
            className="h-16 w-auto"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900">{dict.appName}</h1>
        <p className="mt-2 text-sm text-gray-500">{dict.login.subtitle}</p>

        <GoogleLoginButton
          label={dict.login.googleButton}
          loadingLabel={dict.login.googleButtonLoading}
        />
      </div>
    </div>
  );
}
