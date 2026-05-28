import { useNavigate, useParams } from "react-router";

import { experiences } from "@/app/data/tourism";

import {
  CompanyHero,
  CompanyNotFound,
  CompanyToursList,
} from "./company-tours/components";
import { findCompanyGroupBySlug } from "./company";
import { useFeedReactions } from "./feed/hooks/useFeedReactions";
import { useClientI18n } from "./i18n";

export default function ClientCompanyTours() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { liked, toggleLiked } = useFeedReactions();
  const { t } = useClientI18n();
  const companyGroup = findCompanyGroupBySlug(experiences, slug);

  if (!companyGroup) {
    return (
      <CompanyNotFound
        backLabel={t("back")}
        title={t("companyNotFound")}
        hint={t("companyNotFoundHint")}
        onBack={() => navigate("/client")}
      />
    );
  }

  return (
    <main className="min-h-screen bg-white pb-10 text-gray-950">
      <CompanyHero
        companyGroup={companyGroup}
        backLabel={t("back")}
        exploreMoreLabel={t("exploreMore")}
        tourismCompanyLabel={t("tourismCompany")}
        onBack={() => navigate(-1)}
      />

      <CompanyToursList
        companyGroup={companyGroup}
        title={t("allTours")}
        hint={t("allToursHint")}
        liked={liked}
        onToggleLiked={toggleLiked}
      />
    </main>
  );
}
