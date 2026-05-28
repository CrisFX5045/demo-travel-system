import type { Experience } from "@/app/data/tourism";

export type CompanyGroup = {
  company: string;
  slug: string;
  province: string;
  zone: string;
  image: string;
  rating: number;
  categories: string[];
  experiences: Experience[];
};

export function getCompanySlug(company: string) {
  return company
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCompanyPath(company: string) {
  return `/client/companies/${getCompanySlug(company)}`;
}

export function groupExperiencesByCompany(experiences: Experience[]) {
  const groups = new Map<string, Experience[]>();

  experiences.forEach((experience) => {
    const current = groups.get(experience.company) ?? [];
    groups.set(experience.company, [...current, experience]);
  });

  return Array.from(groups.entries()).map(([company, companyExperiences]) => {
    const firstExperience = companyExperiences[0];
    const rating =
      companyExperiences.reduce(
        (total, experience) => total + experience.rating,
        0,
      ) / companyExperiences.length;

    return {
      company,
      slug: getCompanySlug(company),
      province: firstExperience?.province ?? "",
      zone: firstExperience?.zone ?? "",
      image: firstExperience?.image ?? "",
      rating: Number(rating.toFixed(1)),
      categories: Array.from(
        new Set(companyExperiences.map((experience) => experience.category)),
      ),
      experiences: companyExperiences,
    };
  });
}

export function findCompanyGroupBySlug(
  experiences: Experience[],
  companySlug: string | undefined,
) {
  if (!companySlug) return undefined;

  return groupExperiencesByCompany(experiences).find(
    (group) => group.slug === companySlug,
  );
}
