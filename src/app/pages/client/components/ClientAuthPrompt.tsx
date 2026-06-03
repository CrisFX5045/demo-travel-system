import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

import { useClientI18n } from "../i18n";

export function ClientAuthPrompt({
  isOpen,
  onClose,
  showBackdrop = true,
}: {
  isOpen: boolean;
  onClose: () => void;
  showBackdrop?: boolean;
}) {
  const navigate = useNavigate();
  const { language, t } = useClientI18n();

  const goToLogin = () => {
    onClose();
    navigate("/client/login");
  };

  return (
    <div
      className={`fixed inset-0 z-[80] grid place-items-center px-4 transition-[opacity,visibility] duration-300 ${
        isOpen
          ? "visible pointer-events-auto opacity-100"
          : "invisible pointer-events-none opacity-0"
      }`}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 cursor-pointer transition-opacity ${
          showBackdrop ? "bg-gray-950/45 backdrop-blur-sm" : "bg-transparent"
        }`}
        aria-label={language === "es" ? "Cerrar" : "Close"}
      />
      <section
        role="dialog"
        aria-modal="true"
        className={`relative w-full max-w-[25rem] rounded-[1.65rem] bg-white p-5 text-gray-950 shadow-2xl shadow-gray-950/25 transition-transform duration-300 ease-out md:p-6 ${
          isOpen ? "translate-y-0 scale-100" : "translate-y-3 scale-[0.98]"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid size-9 cursor-pointer place-items-center rounded-full bg-gray-100 text-gray-700 transition hover:bg-gray-200 hover:text-gray-950 active:scale-95"
          aria-label={language === "es" ? "Cerrar" : "Close"}
        >
          <XMarkIcon className="size-5" />
        </button>

        <div className="pr-10">
          <p className="text-xs font-black uppercase text-green-700">
            {language === "es" ? "Cuenta requerida" : "Account required"}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight">
            {language === "es"
              ? "Inicia sesion para guardar favoritos"
              : "Log in to save favorites"}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
            {language === "es"
              ? "Asi podemos mantener tus likes y guardados sincronizados con tu perfil."
              : "That keeps your likes and saved experiences synced with your profile."}
          </p>
        </div>

        <button
          type="button"
          onClick={goToLogin}
          className="mt-5 w-full cursor-pointer rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-gray-800 active:scale-[0.98]"
        >
          {t("signIn")}
        </button>

        <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase text-gray-400">
          <span className="h-px flex-1 bg-gray-100" />
          {t("authDivider")}
          <span className="h-px flex-1 bg-gray-100" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={goToLogin}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-extrabold transition hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
          >
            <img src="/images/logos/google.svg" alt="" className="size-5" />
            <span className="truncate">{t("authContinueGoogle")}</span>
          </button>
          <button
            type="button"
            onClick={goToLogin}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-extrabold transition hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]"
          >
            <img src="/images/logos/apple.svg" alt="" className="size-5 dark:invert" />
            <span className="truncate">{t("authContinueApple")}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
