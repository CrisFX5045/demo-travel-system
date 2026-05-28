import {
  CheckIcon,
  ClipboardDocumentIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { FaFacebookF, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import type { Experience } from "@/app/data/tourism";

import { useClientI18n } from "../../i18n";
import { getExperiencePath } from "../../routes";

type FeedShareSheetProps = {
  experience: Experience;
  isOpen: boolean;
  onClose: () => void;
};

export function FeedShareSheet({
  experience,
  isOpen,
  onClose,
}: FeedShareSheetProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { t, language } = useClientI18n();
  const shareUrl = useMemo(() => {
    const path = getExperiencePath(experience.id);

    if (typeof window === "undefined") return path;

    return `${window.location.origin}${path}`;
  }, [experience.id]);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(
    language === "es"
      ? `Mira esta experiencia: ${experience.title}`
      : `Check out this experience: ${experience.title}`,
  );
  const shareOptions = [
    {
      label: "WhatsApp",
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      className: "bg-emerald-500 text-white",
    },
    {
      label: "Facebook",
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "bg-blue-600 text-white",
    },
    {
      label: "X",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      className: "bg-gray-950 text-white",
    },
    {
      label: "Telegram",
      icon: FaTelegramPlane,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      className: "bg-sky-500 text-white",
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard?.writeText(shareUrl);
    setHasCopied(true);
    window.setTimeout(() => setHasCopied(false), 1400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-[visibility] duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <button
        type="button"
        className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
        aria-label={t("share")}
      />
      <section
        className={`absolute inset-x-0 bottom-0 mx-auto w-full max-w-[38rem] bg-white px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 text-gray-950 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-200" />
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-gray-500">
              {t("share")}
            </p>
            <h2 className="text-lg font-extrabold">{experience.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-full bg-gray-100"
            aria-label={t("back")}
          >
            <XMarkIcon className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-gray-100 p-2">
          <p className="min-w-0 flex-1 truncate px-2 text-sm font-semibold text-gray-600">
            {shareUrl}
          </p>
          <button
            type="button"
            onClick={copyLink}
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-sm"
            aria-label={language === "es" ? "Copiar enlace" : "Copy link"}
          >
            {hasCopied ? (
              <CheckIcon className="size-5 text-emerald-600" />
            ) : (
              <ClipboardDocumentIcon className="size-5" />
            )}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3">
          {shareOptions.map((option) => (
            <a
              key={option.label}
              href={option.href}
              target="_blank"
              rel="noreferrer"
              className="flex min-w-0 flex-col items-center gap-2 text-center"
            >
              <span
                className={`grid size-12 place-items-center rounded-full ${option.className}`}
              >
                <option.icon className="size-5" />
              </span>
              <span className="truncate text-xs font-bold text-gray-600">
                {option.label}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
