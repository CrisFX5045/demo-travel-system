import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import { authApi } from "@/app/api/services";
import { clearClientSession, setClientSession } from "@/app/api/session";
import { useThemeContext } from "@/app/contexts/theme/context";
import { Page } from "@/components/shared/Page";
import { useClientI18n } from "./i18n";

const authImages = [
  "/images/login-singup/1.png",
  "/images/login-singup/2.png",
];

type OAuthTokens = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  expiresAt?: number;
};

export default function ClientAuthCallback() {
  const navigate = useNavigate();
  const { setThemeMode } = useThemeContext();
  const { t } = useClientI18n();
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const hasProcessedCallbackRef = useRef(false);

  useEffect(() => {
    if (hasProcessedCallbackRef.current) return;
    hasProcessedCallbackRef.current = true;

    const completeGoogleAuth = async () => {
      const tokens = getOAuthTokensFromLocation();
      clearOAuthTokensFromUrl();

      if (!tokens?.accessToken) {
        clearClientSession();
        setError(t("authCallbackMissingTokens"));
        return;
      }

      setClientSession({
        provider: "google",
        status: "authenticated",
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: tokens.tokenType,
        expiresIn: tokens.expiresIn,
        expiresAt: tokens.expiresAt,
        createdAt: new Date().toISOString(),
      });

      try {
        const profile = await authApi.getProfileMe(tokens.accessToken);

        if (typeof profile.darkMode === "boolean") {
          setThemeMode(profile.darkMode ? "dark" : "light");
        }

        navigate("/client", { replace: true });
      } catch (error) {
        clearClientSession();
        setError(
          error instanceof Error
            ? error.message
            : t("authCallbackProfileError"),
        );
      }
    };

    void completeGoogleAuth();
  }, [navigate, setThemeMode, t]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % authImages.length);
    }, 10000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <Page title={t("authCallbackPageTitle")}>
      <main className="relative min-h-screen overflow-hidden bg-[#f8f8f6] text-gray-950">
        <AuthCallbackBackground activeImageIndex={activeImageIndex} />

        <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl place-items-center px-4 py-10 md:px-8">
          <section className="relative isolate w-full max-w-[31rem] animate-[auth-card-in_620ms_80ms_ease-out_both]">
            <img
              src="/images/login-singup/3.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-[-60px] z-[2] w-28 drop-shadow-2xl"
              draggable={false}
            />

            <div className="relative z-[1] overflow-hidden rounded-[1.65rem] border border-white/70 bg-white p-6 text-center shadow-2xl shadow-gray-950/15 sm:p-8">
              <div className="mx-auto grid size-14 place-items-center rounded-3xl bg-gray-950 text-white shadow-lg shadow-gray-950/20">
                {error ? (
                  <span className="text-2xl font-black">!</span>
                ) : (
                  <span className="size-7 animate-spin rounded-full border-4 border-white/25 border-t-white" />
                )}
              </div>

              <div className="mt-5 border-b border-gray-100 pb-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-green-700">
                  TicaTour
                </p>
                <h1 className="mt-2 text-[2rem] font-extrabold leading-tight text-gray-950">
                  {error
                    ? t("authCallbackErrorTitle")
                    : t("authCallbackLoadingTitle")}
                </h1>
                <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
                  {error ?? t("authCallbackLoadingMessage")}
                </p>
              </div>

              {error ? (
                <div className="mt-5 grid gap-3">
                  <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                    {error}
                  </p>
                  <Link
                    to="/client/login"
                    className="inline-flex justify-center rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white transition active:scale-[0.98]"
                  >
                    {t("authCallbackBackToLogin")}
                  </Link>
                </div>
              ) : (
                <div className="mt-5">
                  <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-xs font-extrabold text-gray-500">
                    <span className="size-1.5 animate-[auth-dot-bounce_900ms_ease-in-out_infinite] rounded-full bg-current" />
                    <span className="size-1.5 animate-[auth-dot-bounce_900ms_120ms_ease-in-out_infinite] rounded-full bg-current" />
                    <span className="size-1.5 animate-[auth-dot-bounce_900ms_240ms_ease-in-out_infinite] rounded-full bg-current" />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <style>
          {`
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

function AuthCallbackBackground({
  activeImageIndex,
}: {
  activeImageIndex: number;
}) {
  return (
    <div className="absolute inset-0">
      {authImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          className={`absolute inset-0 h-full w-full scale-105 object-cover object-[center_22%] blur-[6px] transition-opacity duration-1000 ease-out ${
            index === activeImageIndex ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
        />
      ))}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

function getOAuthTokensFromLocation(): OAuthTokens | null {
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const searchParams = new URLSearchParams(window.location.search);
  const params = hashParams.get("access_token") ? hashParams : searchParams;
  const accessToken = params.get("access_token");

  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken: params.get("refresh_token") ?? undefined,
    tokenType: params.get("token_type") ?? undefined,
    expiresIn: parseOptionalNumber(params.get("expires_in")),
    expiresAt: parseOptionalNumber(params.get("expires_at")),
  };
}

function clearOAuthTokensFromUrl() {
  window.history.replaceState(
    window.history.state,
    document.title,
    window.location.pathname,
  );
}

function parseOptionalNumber(value: string | null) {
  if (!value) return undefined;

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
}
