import { Navigate, RouteObject } from "react-router";

import AuthGuard from "@/middleware/AuthGuard";
import { AppLayout } from "../layouts/AppLayout";
import { DynamicLayout } from "../layouts/DynamicLayout";

const protectedRoutes: RouteObject = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards/travel" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/travel" />,
            },
            {
              path: "travel",
              lazy: async () => ({
                Component: (await import("@/app/pages/dashboards/travel"))
                  .default,
              }),
            },
          ],
        },
        {
          path: "apps",
          children: [
            {
              index: true,
              element: <Navigate to="/apps/travel" />,
            },
            {
              path: "travel",
              lazy: async () => ({
                Component: (await import("@/app/pages/apps/travel")).default,
              }),
            },
          ],
        },
      ],
    },
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("@/app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/settings/sections/General")
                ).default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
            {
              path: "notifications",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/settings/sections/Notifications")
                ).default,
              }),
            },
            {
              path: "sessions",
              lazy: async () => ({
                Component: (
                  await import("@/app/pages/settings/sections/Sessions")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
