import { NavigationTree } from "@/@types/navigation";
import { baseNavigationObj } from "../baseNavigation";

export const apps: NavigationTree = {
  ...baseNavigationObj["apps"],
  type: "root",
  childs: [
    {
      id: "apps.travel",
      path: "/apps/travel",
      type: "item",
      title: "Experiencias",
      transKey: "nav.apps.travel",
      icon: "apps.travel",
    },
  ],
};
