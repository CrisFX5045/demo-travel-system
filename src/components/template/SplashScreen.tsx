// Local Imports
import Logo from "@/assets/appLogo.svg?react";
import { Progress } from "@/components/ui";

// ----------------------------------------------------------------------

export function SplashScreen() {
  return (
    <>
      <div className="fixed inset-0 z-100 grid h-full w-full place-content-center bg-gray-50 text-gray-950 dark:bg-gray-50 dark:text-gray-950">
        <Logo className="size-28" />
        <Progress
          color="primary"
          isIndeterminate
          animationDuration="1s"
          className="mt-2 h-1"
        />
      </div>
    </>
  );
}
