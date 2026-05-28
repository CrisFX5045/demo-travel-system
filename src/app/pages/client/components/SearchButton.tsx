import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router";

import { useClientI18n } from "../i18n";

export function SearchButton() {
  const { t } = useClientI18n();

  return (
    <Link
      to="/client/search"
      className="flex h-14 w-full items-center gap-3 rounded-full bg-gray-100 px-5 text-left shadow-sm"
    >
      <MagnifyingGlassIcon className="size-6 text-gray-950" />
      <span className="text-lg font-bold text-gray-500">
        {t("searchExperiences")}
      </span>
    </Link>
  );
}
