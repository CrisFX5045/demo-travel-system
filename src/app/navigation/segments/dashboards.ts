import { NavigationTree } from "@/@types/navigation";
import { baseNavigationObj } from "../baseNavigation";

export const dashboards: NavigationTree = {
  ...baseNavigationObj["dashboards"],
  type: "root",
  childs: [
    {
      id: "dashboards.travel",
      path: "/dashboards/travel",
      type: "item",
      title: "Dashboard Travel",
      transKey: "nav.dashboards.travel",
      icon: "dashboards.travel",
    },
  ],
};
