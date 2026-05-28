import type { Experience } from "@/app/data/tourism";
import { Link } from "react-router";

import { useClientI18n } from "../i18n";
import { formatExperiencePrice, getPromotionPrice } from "../price";
import { getExperiencePath } from "../routes";
import { SectionHeader } from "./SectionHeader";

export function PromotionsSection({
  experiences,
}: {
  experiences: Experience[];
}) {
  const { t } = useClientI18n();
  const promotedExperiences = experiences
    .filter((experience) => experience.promoted)
    .slice(0, 3);

  return (
    <section className="px-4 pb-8 md:px-8 md:pb-10">
      <SectionHeader
        title={t("specialOffers")}
        subtitle={t("specialOffersSubtitle")}
        to="/client/explore?filter=Ofertas"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {promotedExperiences.map((experience, index) => {
          const promotion = experience.promotion ?? getPromotionCopy(index);
          const promotionPrice = getPromotionPrice(experience);

          return (
            <Link
              key={experience.id}
              to={getExperiencePath(experience.id)}
              state={{ from: "/client" }}
              className="group relative min-h-64 overflow-hidden rounded-[1.65rem] bg-gray-950 p-4 text-white shadow-sm transition-transform duration-200 active:scale-[0.99] md:min-h-72 md:p-5"
            >
              <img
                src={experience.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/15" />
              <div className="absolute left-4 top-4 flex items-center gap-2 md:left-5 md:top-5">
                <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-black uppercase tracking-wide shadow-lg shadow-red-950/20">
                  {promotion.badge}
                </span>
                {index === 0 && (
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-gray-950">
                    {t("mostBooked")}
                  </span>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="text-sm font-bold text-white/75">
                  {experience.company}
                </p>
                <h3 className="mt-1 truncate text-2xl font-black leading-tight md:text-3xl">
                  {experience.title}
                </h3>
                <p className="mt-2 truncate text-sm font-bold text-white/80">
                  {promotion.title}
                </p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="rounded-2xl bg-white px-3 py-2 text-gray-950 shadow-xl shadow-black/15">
                    <p className="text-[0.62rem] font-black uppercase">
                      {t("pricePromo")}
                    </p>
                  {promotionPrice ? (
                    <div className="mt-0.5">
                      <p className="text-xs font-bold text-gray-400 line-through">
                        {promotionPrice.original}
                      </p>
                      <p className="text-xl font-black leading-none">
                        {promotionPrice.final}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-0.5 text-xl font-black leading-none">
                      {formatExperiencePrice(experience)}
                    </p>
                  )}
                    <p className="mt-1 text-[0.68rem] font-bold text-gray-500">
                      {t("perPerson")}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-extrabold backdrop-blur">
                    {t("viewOffer")}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function getPromotionCopy(index: number) {
  const promotions = [
    {
      badge: "2x1",
      title: "Dos por uno",
      description:
        "Reserva esta experiencia y aprovecha una promocion 2x1 por tiempo limitado.",
    },
    {
      badge: "Familia",
      title: "Paga 3 y niños gratis",
      description:
        "Promocion familiar disponible para grupos seleccionados.",
    },
    {
      badge: "Oferta especial",
      title: "Precio especial por tiempo limitado",
      description:
        "Precio especial por tiempo limitado para reservas anticipadas.",
    },
  ];

  return promotions[index] ?? promotions[2];
}
