import { NavigationTree } from "@/@types/navigation";

export const baseNavigationObj: Record<string, NavigationTree> = {
  dashboards: {
    id: "dashboards",
    type: "item",
    path: "/dashboards",
    title: "Administracion",
    transKey: "nav.dashboards.dashboards",
    icon: "dashboards",
  },
  apps: {
    id: "apps",
    type: "item",
    path: "/apps",
    title: "Travel",
    transKey: "nav.apps.apps",
    icon: "apps",
  },
};

export const baseNavigation: NavigationTree[] = Object.values(baseNavigationObj);
