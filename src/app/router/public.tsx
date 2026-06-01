import { Navigate, RouteObject } from "react-router";

const publicRoutes: RouteObject = {
  id: "public",
  children: [
    {
      index: true,
      element: <Navigate to="/client" replace />,
    },
    {
      path: "client",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/Home")).default,
      }),
    },
    {
      path: "client/login",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/ClientLogin")).default,
      }),
    },
    {
      path: "client/signup",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/ClientSignup")).default,
      }),
    },
    {
      path: "client/feed",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/Feed")).default,
      }),
    },
    {
      path: "client/favorites",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/Favorites")).default,
      }),
    },
    {
      path: "client/profile",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/Profile")).default,
      }),
    },
    {
      path: "client/profile/bookings",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/ProfileBookings")).default,
      }),
    },
    {
      path: "client/profile/bookings/:id",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/ProfileBookingDetail"))
          .default,
      }),
    },
    {
      path: "client/profile/tours",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/ProfileToursHistory"))
          .default,
      }),
    },
    {
      path: "client/profile/reviews",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/ProfileReviews")).default,
      }),
    },
    {
      path: "client/explore",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/Explore")).default,
      }),
    },
    {
      path: "client/search",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/Search")).default,
      }),
    },
    {
      path: "client/companies/:slug",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/CompanyTours")).default,
      }),
    },
    {
      path: "client/experiences/:id",
      lazy: async () => ({
        Component: (await import("@/app/pages/client/ExperienceDetail"))
          .default,
      }),
    },
  ],
};

export { publicRoutes };
