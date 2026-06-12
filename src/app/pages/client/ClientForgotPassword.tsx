import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router";

import { authApi } from "@/app/api/services";
import { Page } from "@/components/shared/Page";
import { Button, Card, Input } from "@/components/ui";
import { clientLanguages, useClientI18n } from "./i18n";

const authImages = [
  "/images/login-singup/1.png",
  "/images/login-singup/2.png",
];

export default function ClientForgotPassword() {
  const { language, setLanguage, t } = useClientI18n();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [emailSentTo, setEmailSentTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % authImages.length);
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setFormError(t("authForgotEmailRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authApi.forgotPassword({
        email,
        redirectTo: getDefaultPasswordResetUrl(),
      });

      setEmailSentTo(response.data?.email || email);
    } catch (error) {
      setFormError(getForgotPasswordErrorMessage(error, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title={`Cliente - ${t("authForgotPageTitle")}`}>
      <main className="relative min-h-screen overflow-hidden bg-[#f8f8f6] text-gray-950">
        <AuthImageCarousel activeImageIndex={activeImageIndex} />

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center px-4 pb-6 pt-20 md:px-8 md:py-6 lg:py-10">
          <section className="relative isolate mx-auto w-full max-w-[31rem] animate-[auth-card-in_620ms_80ms_ease-out_both]">
            <img
              src="/images/login-singup/3.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-[-60px] z-[999] w-28 drop-shadow-2xl"
              draggable={false}
            />
            <Card className="relative z-10 rounded-[1.65rem] border border-gray-100 bg-white p-5 shadow-2xl shadow-gray-950/15 sm:p-7 md:p-8 md:shadow-xl md:shadow-gray-950/10">
              <div className="mb-6 flex animate-[auth-panel-in_520ms_120ms_ease-out_both] items-center justify-between gap-3">
                <Link
                  to="/client/login"
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-500 transition hover:text-gray-950"
                >
                  <ArrowLeftIcon className="size-4" />
                  {t("authForgotBackToLogin")}
                </Link>

                <div className="relative grid grid-cols-2 rounded-full bg-gray-100 p-1 shadow-sm shadow-gray-950/5">
                  <span
                    className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-gray-950 transition-transform duration-300 ease-out ${
                      language === "en" ? "translate-x-full" : "translate-x-0"
                    }`}
                  />
                  {clientLanguages.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLanguage(item.code)}
                      className={`relative z-10 rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors duration-200 ${
                        item.code === language
                          ? "text-white"
                          : "text-gray-500 hover:text-gray-950"
                      }`}
                      aria-label={`${t("language")}: ${item.label}`}
                    >
                      {item.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              {emailSentTo ? (
                <div className="grid gap-5 text-center">

                  <div>
                    <h1 className="text-[2rem] font-extrabold leading-tight text-gray-950">
                      {t("authForgotSuccessTitle")}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {t("authForgotSuccessMessage")}
                    </p>
                    <span className="mx-auto grid size-16 place-items-center rounded-full bg-green-50 text-green-700">
                    <CheckCircleIcon className="size-9" />
                    </span>
                    <p className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-extrabold text-gray-700">
                      {emailSentTo}
                    </p>
                  </div>
                  <Button
                    component={Link}
                    to="/client/login"
                    color="primary"
                    className="h-12 w-full rounded-full font-extrabold shadow-lg shadow-primary-500/20"
                  >
                    {t("authForgotBackToLogin")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="border-b border-gray-100 pb-5">
                    <h1 className="text-[2rem] font-extrabold leading-tight text-gray-950">
                      {t("authForgotTitle")}
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {t("authForgotSubtitle")}
                    </p>
                  </div>

                  <form onSubmit={submitForm} className="mt-5 grid gap-4">
                    <Input
                      required
                      name="email"
                      label={t("authEmail")}
                      placeholder={t("authEmailPlaceholder")}
                      type="email"
                      prefix={<EnvelopeIcon className="size-5" strokeWidth={1.5} />}
                    />

                    {formError && (
                      <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                        {formError}
                      </p>
                    )}

                    <Button
                      type="submit"
                      color="primary"
                      className="h-12 w-full rounded-full font-extrabold shadow-lg shadow-primary-500/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <AuthSubmittingLabel label={t("authForgotSubmitting")} />
                      ) : (
                        t("authForgotAction")
                      )}
                    </Button>
                  </form>
                </>
              )}
            </Card>
          </section>
        </div>

        <style>
          {`
            @keyframes auth-panel-in {
              from {
                opacity: 0;
                transform: translateY(14px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes auth-card-in {
              from {
                opacity: 0;
                transform: translateY(18px) scale(0.985);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            @keyframes auth-dot-bounce {
              0%,
              80%,
              100% {
                opacity: 0.35;
                transform: translateY(0) scale(0.82);
              }
              40% {
                opacity: 1;
                transform: translateY(-3px) scale(1);
              }
            }
          `}
        </style>
      </main>
    </Page>
  );
}

function getDefaultPasswordResetUrl() {
  const basePath = import.meta.env.BASE_URL ?? "/";
  const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;

  return new URL(
    `${normalizedBasePath.replace(/^\//, "")}reset-password`,
    window.location.origin,
  ).toString();
}

function getForgotPasswordErrorMessage(
  error: unknown,
  t: ReturnType<typeof useClientI18n>["t"],
) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return t("authForgotGenericError");
}

function AuthSubmittingLabel({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center gap-2">
      <span>{label}</span>
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        <span className="size-1.5 animate-[auth-dot-bounce_900ms_ease-in-out_infinite] rounded-full bg-current" />
        <span className="size-1.5 animate-[auth-dot-bounce_900ms_120ms_ease-in-out_infinite] rounded-full bg-current" />
        <span className="size-1.5 animate-[auth-dot-bounce_900ms_240ms_ease-in-out_infinite] rounded-full bg-current" />
      </span>
    </span>
  );
}

function AuthImageCarousel({ activeImageIndex }: { activeImageIndex: number }) {
  return (
    <>
      <div className="absolute inset-0 md:hidden">
        {authImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              index === activeImageIndex ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        ))}
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="absolute inset-0 z-0 hidden md:block">
        {authImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt=""
            className={`absolute inset-0 z-0 h-full w-full scale-105 object-cover object-[center_22%] blur-[6px] transition-opacity duration-1000 ease-out ${
              index === activeImageIndex ? "opacity-100" : "opacity-0"
            }`}
            draggable={false}
          />
        ))}
        <div className="absolute inset-0 z-[1] bg-black/35" />
      </div>
    </>
  );
}
