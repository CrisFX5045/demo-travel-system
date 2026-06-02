import {
  BookmarkIcon as BookmarkOutlineIcon,
  HeartIcon as HeartOutlineIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkSolidIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import type { ElementType } from "react";

import { useClientI18n } from "../../i18n";
import { getPromotionPrice } from "../../price";

export function BookingCard({
  price,
  promotionPrice,
  promotion,
  nextSlot,
  isLiked,
  isSaved,
  onToggleLiked,
  onToggleSaved,
  onShare,
  onRequestBooking,
  onContactCompany,
}: {
  price: string;
  promotionPrice: ReturnType<typeof getPromotionPrice>;
  promotion?: {
    badge: string;
    title: string;
    description: string;
    discountPercent?: number;
  };
  nextSlot: string;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLiked: () => void;
  onToggleSaved: () => void;
  onShare: () => void;
  onRequestBooking: () => void;
  onContactCompany: () => void;
}) {
  const { t } = useClientI18n();

  return (
    <aside className="hidden h-fit rounded-3xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/70 [animation:client-experience-card-in_540ms_260ms_cubic-bezier(.22,1,.36,1)_both] xl:block">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-gray-500">{t("from")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {promotionPrice ? (
              <div>
                <p className="text-sm font-bold text-gray-400 line-through">
                  {promotionPrice.original}
                </p>
                <p className="text-3xl font-extrabold">
                  {promotionPrice.final}
                </p>
              </div>
            ) : (
              <p className="text-3xl font-extrabold">{price}</p>
            )}
            {promotion && (
              <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-extrabold text-white">
                {promotion.badge}
              </span>
            )}
          </div>
          {promotion && (
            <p className="mt-1 text-sm font-extrabold text-red-600">
              {promotion.title}
            </p>
          )}
          <p className="mt-1 text-xs font-bold text-gray-500">
            {t("nextSlot")}: {nextSlot}
          </p>
        </div>
        <div className="flex gap-2">
          <CardAction
            icon={HeartOutlineIcon}
            activeIcon={HeartSolidIcon}
            isActive={isLiked}
            activeClassName="text-rose-600"
            label={t("like")}
            onClick={onToggleLiked}
          />
          <CardAction
            icon={BookmarkOutlineIcon}
            activeIcon={BookmarkSolidIcon}
            isActive={isSaved}
            activeClassName="text-yellow-500"
            label={t("save")}
            onClick={onToggleSaved}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={onRequestBooking}
        className="mt-5 w-full rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-gray-800 active:scale-[0.97]"
      >
        {t("requestBooking")}
      </button>
      <button
        type="button"
        onClick={onContactCompany}
        className="mt-3 w-full rounded-full bg-gray-100 px-5 py-3 text-sm font-extrabold transition hover:bg-gray-200 active:scale-[0.97]"
      >
        {t("contactCompany")}
      </button>
      <button
        type="button"
        onClick={onShare}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-extrabold transition hover:bg-gray-50 active:scale-[0.97]"
      >
        <ShareIcon className="size-5" />
        {t("share")}
      </button>
    </aside>
  );
}

function CardAction({
  icon: Icon,
  activeIcon: ActiveIcon,
  isActive,
  activeClassName,
  label,
  onClick,
}: {
  icon: ElementType;
  activeIcon: ElementType;
  isActive: boolean;
  activeClassName: string;
  label: string;
  onClick: () => void;
}) {
  const DisplayIcon = isActive ? ActiveIcon : Icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full bg-gray-100 transition hover:bg-gray-200 active:scale-90"
      aria-label={label}
    >
      <DisplayIcon
        className={`size-5 transition-colors ${isActive ? activeClassName : ""}`}
      />
    </button>
  );
}
