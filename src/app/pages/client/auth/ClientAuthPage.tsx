import {
  ArrowLeftIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Page } from "@/components/shared/Page";
import { Button, Card, Checkbox, Input } from "@/components/ui";
import { clientLanguages, useClientI18n } from "../i18n";

type AuthMode = "login" | "signup";
type AuthProvider = "email" | "google" | "apple";

type SupabasePasswordTokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at?: number;
  user: {
    id: string;
    email?: string;
    role?: string;
  };
};

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
  const [acceptedTerms, setAcceptedTerms] = useState(mode === "login");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const copy = authCopy[mode];
  const isSignup = mode === "signup";

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % authImages.length);
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  const completeDemoAuth = (provider: AuthProvider) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "clientSession",
        JSON.stringify({
          provider,
          status: "demo-authenticated",
          createdAt: new Date().toISOString(),
        }),
      );
    }

    navigate("/client/profile");
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);

    if (isSignup) {
      completeDemoAuth("email");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setAuthError("Ingresa tu correo y contrasena.");
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await loginWithPassword({ email, password });
      const profile = await fetchClientProfile(session.access_token);

      window.localStorage.setItem(
        "clientSession",
        JSON.stringify({
          provider: "email",
          status: "authenticated",
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          tokenType: session.token_type,
          expiresIn: session.expires_in,
          expiresAt: session.expires_at,
          user: session.user,
          profile,
          createdAt: new Date().toISOString(),
        }),
      );

      navigate("/client/profile");
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "No se pudo iniciar sesion.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title={`Cliente - ${t(copy.title)}`}>
      <main className="relative min-h-screen overflow-hidden bg-[#f8f8f6] text-gray-950">
        <AuthImageCarousel activeImageIndex={activeImageIndex} variant="mobile" />

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-8 px-4 py-6 md:grid-cols-[28rem_minmax(0,1fr)] md:px-8 lg:py-10">
          <section className="animate-[auth-panel-in_520ms_ease-out_both]">
            <Card className="animate-[auth-card-in_620ms_80ms_ease-out_both] rounded-[1.65rem] border border-gray-100 bg-white p-5 shadow-2xl shadow-gray-950/15 sm:p-7 md:shadow-xl md:shadow-gray-950/5">
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

              <form onSubmit={submitForm} className="mt-5 grid gap-4">
                {isSignup && (
                  <Input
                    required
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
                    label={t("authPhone")}
                    placeholder={t("authPhonePlaceholder")}
                    type="tel"
                    prefix={<PhoneIcon className="size-5" strokeWidth={1.5} />}
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
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    {authError}
                  </p>
                )}

                <div className="flex items-center justify-between gap-3 text-sm">
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
                  className="h-12 w-full rounded-full font-extrabold shadow-lg shadow-primary-500/20"
                  disabled={(isSignup && !acceptedTerms) || isSubmitting}
                >
                  {isSubmitting ? "Validando..." : t(copy.action)}
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
                  onClick={() => completeDemoAuth("google")}
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
                    className="size-5"
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

          <section className="hidden min-h-[35rem] animate-[auth-media-in_650ms_ease-out_both] overflow-hidden rounded-[2rem] bg-gray-950 md:block">
            <AuthImageCarousel
              activeImageIndex={activeImageIndex}
              variant="desktop"
            />
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
          `}
        </style>
      </main>
    </Page>
  );
}

function AuthImageCarousel({
  activeImageIndex,
  variant,
}: {
  activeImageIndex: number;
  variant: "desktop" | "mobile";
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

async function loginWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const url = buildUrl(
    import.meta.env.VITE_SUPABASE_AUTH_BASE_URL,
    import.meta.env.VITE_API_CLIENT_LOGIN,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: buildSupabaseHeaders(),
    body: JSON.stringify({ email, password }),
  });

  const data = await readJsonResponse<SupabasePasswordTokenResponse>(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, "Credenciales invalidas."));
  }

  if (!data.access_token || !data.refresh_token) {
    throw new Error("La respuesta de autenticacion no contiene tokens.");
  }

  return data;
}

async function fetchClientProfile(accessToken: string) {
  const profileUrl = import.meta.env.VITE_API_CLIENT_PROFILE;

  if (!profileUrl) {
    return null;
  }

  const response = await fetch(profileUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const data = await readJsonResponse<unknown>(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(data, "No se pudo cargar el perfil."));
  }

  return data;
}

function buildSupabaseHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (anonKey) {
    headers.apikey = anonKey;
  }

  return headers;
}

function buildUrl(baseUrl?: string, path?: string) {
  if (!baseUrl || !path) {
    throw new Error("Faltan variables de entorno para autenticacion.");
  }

  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return null as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("La API respondio con un formato no valido.");
  }
}

function getApiErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    if (typeof record.msg === "string") return record.msg;
    if (typeof record.message === "string") return record.message;
    if (typeof record.error_description === "string") {
      return record.error_description;
    }
    if (typeof record.error === "string") return record.error;
  }

  return fallback;
}
