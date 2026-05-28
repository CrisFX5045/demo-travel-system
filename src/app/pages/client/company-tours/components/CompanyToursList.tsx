import { CompanyTourBlock } from "../../components";
import type { CompanyGroup } from "../../company";

export function CompanyToursList({
  companyGroup,
  title,
  hint,
  liked,
  onToggleLiked,
}: {
  companyGroup: CompanyGroup;
  title: string;
  hint: string;
  liked: Record<string, boolean>;
  onToggleLiked: (experienceId: string) => void;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
      <section className="mb-6">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          {hint}
        </p>
      </section>

      <CompanyTourBlock
        group={companyGroup}
        liked={liked}
        onToggleLiked={onToggleLiked}
        showCompanyHeader={false}
        layout="two-columns"
      />
    </div>
  );
}
