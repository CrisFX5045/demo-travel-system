import { experiences } from "@/app/data/tourism";

export const upcomingBookingIds = ["EXP-1042", "EXP-1188"];
export const pastTourIds = ["EXP-1217", "EXP-1475"];

export function getUpcomingBookings() {
  return experiences.filter((experience) =>
    upcomingBookingIds.includes(experience.id),
  );
}

export function getPastTours() {
  return experiences.filter((experience) => pastTourIds.includes(experience.id));
}

export function getProfileBookingById(id: string | undefined) {
  if (!id) return undefined;

  return experiences.find((experience) => experience.id === id);
}

export function getBookingCode(experienceId: string) {
  return `CR-${experienceId.replace("EXP-", "")}-26`;
}
