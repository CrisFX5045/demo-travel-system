import {
  ArrowLeftIcon,
  BanknotesIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { authApi } from "@/app/api/services";
import { setClientSession } from "@/app/api/session";
import { useThemeContext } from "@/app/contexts/theme/context";
import { Page } from "@/components/shared/Page";
import { Button, Card, Checkbox, Input } from "@/components/ui";
import { clientLanguages, useClientI18n } from "../i18n";

type AuthMode = "login" | "signup";
type AuthProvider = "email" | "google" | "apple";
type PreferredCurrency = "CRC" | "USD";

const currencyOptions: Array<{
  value: PreferredCurrency;
  label: string;
}> = [
  { value: "CRC", label: "CRC - Colon costarricense" },
  { value: "USD", label: "USD - Dollar estadounidense" },
];

const authImages = [
  "/images/login-singup/1.png",
  "/images/login-singup/2.png",
];

const authCopy = {
  login: {
    title: "authLoginTitle",
    subtitle: "authLoginSubtitle",
    action: "authLoginAction",
    switchText: "authLoginSwitchText",
    switchAction: "authLoginSwitchAction",
    switchHref: "/client/signup",
  },
  signup: {
    title: "authSignupTitle",
    subtitle: "authSignupSubtitle",
    action: "authSignupAction",
    switchText: "authSignupSwitchText",
    switchAction: "authSignupSwitchAction",
    switchHref: "/client/login",
  },
} satisfies Record<AuthMode, {
  title: Parameters<ReturnType<typeof useClientI18n>["t"]>[0];
  subtitle: Parameters<ReturnType<typeof useClientI18n>["t"]>[0];
  action: Parameters<ReturnType<typeof useClientI18n>["t"]>[0];
  switchText: Parameters<ReturnType<typeof useClientI18n>["t"]>[0];
  switchAction: Parameters<ReturnType<typeof useClientI18n>["t"]>[0];
  switchHref: string;
}>;

export function ClientAuthPage({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useClientI18n();
  const { isDark, setThemeMode } = useThemeContext();
  const [acceptedTerms, setAcceptedTerms] = useState(mode === "login");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [preferredCurrency, setPreferredCurrency] =
    useState<PreferredCurrency>("CRC");
  const copy = authCopy[mode];
  const isSignup = mode === "signup";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % authImages.length);
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  const completeDemoAuth = (provider: AuthProvider) => {
    setClientSession({
      provider,
      status: "demo-authenticated",
      createdAt: new Date().toISOString(),
    });

    navigate("/client");
  };

  const startGoogleAuth = () => {
    const googleAuthUrl = buildSupabaseGoogleAuthUrl();

    if (!googleAuthUrl) {
      setAuthError(t("authGoogleNotConfigured"));
      return;
    }

    window.location.assign(googleAuthUrl);
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setAuthError(t("authEmailPasswordRequired"));
      return;
    }

    setIsSubmitting(true);

    try {
      let nextDarkMode: boolean | undefined;

      if (isSignup) {
        const fullName = String(formData.get("fullName") ?? "").trim();
        const phone = String(formData.get("phone") ?? "").trim();
        const currency = parsePreferredCurrency(formData.get("preferredCurrency"));

        if (!fullName) {
          setAuthError(t("authFullNameRequired"));
          return;
        }

        const { profile } = await authApi.registerTraveler({
          email,
          password,
          fullName,
          phone: phone || undefined,
          preferredLanguage: language,
          preferredCurrency: currency,
          darkMode: isDark,
        });
        nextDarkMode = profile.darkMode ?? isDark;
      } else {
        const { profile } = await authApi.loginWithPassword({ email, password });
        nextDarkMode = profile.darkMode;
      }

      if (typeof nextDarkMode === "boolean") {
        setThemeMode(nextDarkMode ? "dark" : "light");
      }

      navigate("/client");
    } catch (error) {
      setAuthError(getAuthErrorMessage(error, isSignup, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title={`Cliente - ${t(copy.title)}`}>
      <main className="relative min-h-screen overflow-hidden bg-[#f8f8f6] text-gray-950">
        <AuthImageCarousel activeImageIndex={activeImageIndex} variant="mobile" />
        <AuthImageCarousel activeImageIndex={activeImageIndex} variant="desktop-bg" />

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center px-4 pb-6 pt-20 md:px-8 md:py-6 lg:py-10">
          <section
            className={`relative isolate mx-auto w-full animate-[auth-card-in_620ms_80ms_ease-out_both] ${
              isSignup ? "max-w-[58rem]" : "max-w-[31rem]"
            }`}
          >
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
                  to="/client"
                  className="inline-flex items-center gap-2 text-sm font-extrabold text-gray-500 transition hover:text-gray-950"
                >
                  <ArrowLeftIcon className="size-4" />
                  {t("authBackToExplore")}
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

              <div className="border-b border-gray-100 pb-5">
                <h1 className="text-[2rem] font-extrabold leading-tight text-gray-950">
                  {t(copy.title)}
                </h1>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {t(copy.subtitle)}
                </p>
              </div>

              <form
                onSubmit={submitForm}
                className={`mt-5 grid gap-4 ${
                  isSignup ? "md:grid-cols-2" : ""
                }`}
              >
                {isSignup && (
                  <Input
                    required
                    name="fullName"
                    label={t("authFullName")}
                    placeholder={t("authFullNamePlaceholder")}
                    prefix={<UserIcon className="size-5" strokeWidth={1.5} />}
                  />
                )}

                <Input
                  required
                  name="email"
                  label={t("authEmail")}
                  placeholder={t("authEmailPlaceholder")}
                  type="email"
                  prefix={<EnvelopeIcon className="size-5" strokeWidth={1.5} />}
                />

                {isSignup && (
                  <Input
                    name="phone"
                    label={t("authPhone")}
                    placeholder={t("authPhonePlaceholder")}
                    type="tel"
                    prefix={<PhoneIcon className="size-5" strokeWidth={1.5} />}
                  />
                )}

                {isSignup && (
                  <CurrencyDropdown
                    value={preferredCurrency}
                    onChange={setPreferredCurrency}
                    label={t("authPreferredCurrency")}
                  />
                )}

                <Input
                  required
                  name="password"
                  label={t("authPassword")}
                  placeholder={
                    isSignup
                      ? t("authPasswordSignupPlaceholder")
                      : t("authPasswordPlaceholder")
                  }
                  type="password"
                  minLength={isSignup ? 8 : undefined}
                  prefix={<LockClosedIcon className="size-5" strokeWidth={1.5} />}
                />

                {authError && (
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 md:col-span-2">
                    {authError}
                  </p>
                )}

                <div
                  className={`flex items-center justify-between gap-3 text-sm ${
                    isSignup ? "md:col-span-2" : ""
                  }`}
                >
                  <Checkbox
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    label={isSignup ? t("authTerms") : t("authRememberMe")}
                    classNames={{ labelText: "font-bold text-gray-600" }}
                  />
                  {!isSignup && (
                    <a href="#reset" className="font-bold text-green-700">
                      {t("authForgotPassword")}
                    </a>
                  )}
                </div>

                <Button
                  type="submit"
                  color="primary"
                  className={`h-12 w-full rounded-full font-extrabold shadow-lg shadow-primary-500/20 ${
                    isSignup ? "md:col-span-2" : ""
                  }`}
                  disabled={(isSignup && !acceptedTerms) || isSubmitting}
                >
                  {isSubmitting ? (
                    <AuthSubmittingLabel
                      label={
                        isSignup
                          ? t("authSignupSubmitting")
                          : t("authLoginSubmitting")
                      }
                    />
                  ) : (
                    t(copy.action)
                  )}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase text-gray-400">
                <span className="h-px flex-1 bg-gray-100" />
                {t("authDivider")}
                <span className="h-px flex-1 bg-gray-100" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outlined"
                  className="h-11 justify-center gap-2 rounded-full border-gray-200 font-extrabold"
                  onClick={startGoogleAuth}
                >
                  <img
                    src="/images/logos/google.svg"
                    alt=""
                    className="size-5"
                    draggable={false}
                  />
                  {t("authContinueGoogle")}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  className="h-11 justify-center gap-2 rounded-full border-gray-200 font-extrabold"
                  onClick={() => completeDemoAuth("apple")}
                >
                  <img
                    src="/images/logos/apple.svg"
                    alt=""
                    className="size-5 dark:invert"
                    draggable={false}
                  />
                  {t("authContinueApple")}
                </Button>
              </div>

              <p className="mt-5 text-center text-sm font-bold text-gray-500">
                {t(copy.switchText)}{" "}
                <Link to={copy.switchHref} className="text-green-700">
                  {t(copy.switchAction)}
                </Link>
              </p>
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

            @keyframes auth-media-in {
              from {
                opacity: 0;
                transform: translateX(-16px) scale(0.985);
              }
              to {
                opacity: 1;
                transform: translateX(0) scale(1);
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

function CurrencyDropdown({
  value,
  onChange,
  label,
}: {
  value: PreferredCurrency;
  onChange: (value: PreferredCurrency) => void;
  label: string;
}) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="relative">
        <BanknotesIcon
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
          strokeWidth={1.5}
        />
        <select
          name="preferredCurrency"
          value={value}
          onChange={(event) =>
            onChange(parsePreferredCurrency(event.target.value))
          }
          className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-11 pr-10 text-sm font-medium text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30"
        >
          {currencyOptions.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-400"
          strokeWidth={1.8}
        />
      </div>
    </div>
  );
}

function parsePreferredCurrency(value: FormDataEntryValue | string | null): PreferredCurrency {
  return value === "USD" ? "USD" : "CRC";
}

function getAuthErrorMessage(
  error: unknown,
  isSignup: boolean,
  t: ReturnType<typeof useClientI18n>["t"],
) {
  const apiData =
    error && typeof error === "object" && "data" in error
      ? (error as { data?: unknown }).data
      : null;
  const apiRecord =
    apiData && typeof apiData === "object"
      ? (apiData as Record<string, unknown>)
      : null;
  const nestedError =
    apiRecord?.error && typeof apiRecord.error === "object"
      ? (apiRecord.error as Record<string, unknown>)
      : null;
  const apiCode =
    getStringValue(apiRecord?.code) ?? getStringValue(nestedError?.code) ?? "";

  if (apiCode === "EMAIL_ALREADY_EXISTS") {
    return t("authEmailAlreadyExists");
  }

  const apiMessage =
    getStringValue(apiRecord?.message) ??
    getStringValue(apiRecord?.msg) ??
    getStringValue(nestedError?.message) ??
    getStringValue(nestedError?.msg);

  if (apiMessage) {
    return apiMessage;
  }

  if (error instanceof Error && error.message.trim()) {
    if (error.message === "A user with this email already exists.") {
      return t("authEmailAlreadyExists");
    }

    return error.message;
  }

  return isSignup ? t("authSignupGenericError") : t("authLoginGenericError");
}

function getStringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function buildSupabaseGoogleAuthUrl() {
  const authBaseUrl = import.meta.env.VITE_SUPABASE_AUTH_BASE_URL;
  const callbackUrl = getClientAuthCallbackUrl();

  if (!authBaseUrl || !callbackUrl) return null;

  const url = new URL(`${authBaseUrl.replace(/\/$/, "")}/authorize`);
  url.searchParams.set("provider", "google");
  url.searchParams.set("redirect_to", callbackUrl);

  return url.toString();
}

function getClientAuthCallbackUrl() {
  const envCallbackUrl = import.meta.env.VITE_CLIENT_AUTH_CALLBACK_URL;

  if (typeof envCallbackUrl === "string" && envCallbackUrl.trim()) {
    return envCallbackUrl;
  }

  return getDefaultClientAuthCallbackUrl();
}

function getDefaultClientAuthCallbackUrl() {
  const basePath = import.meta.env.BASE_URL ?? "/";
  const normalizedBasePath = basePath.endsWith("/") ? basePath : `${basePath}/`;

  return new URL(
    `${normalizedBasePath.replace(/^\//, "")}client/auth/callback`,
    window.location.origin,
  ).toString();
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

function AuthImageCarousel({
  activeImageIndex,
  variant,
}: {
  activeImageIndex: number;
  variant: "desktop" | "desktop-bg" | "mobile";
}) {
  if (variant === "mobile") {
    return (
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
    );
  }

  if (variant === "desktop-bg") {
    return (
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
    );
  }

  return (
    <div className="relative h-full min-h-[35rem] w-full">
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
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/25 via-transparent to-transparent" />
      <div className="absolute bottom-5 left-5 flex gap-2">
        {authImages.map((image, index) => (
          <span
            key={image}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === activeImageIndex ? "w-8 bg-white" : "w-2 bg-white/55"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
