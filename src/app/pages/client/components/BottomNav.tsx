import { Link } from "react-router";

import type { ClientNavItem } from "../content";
import { useClientI18n } from "../i18n";

export function BottomNav({
  isVisible,
  navItems,
}: {
  isVisible: boolean;
  navItems: ClientNavItem[];
}) {
  const { text } = useClientI18n();

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-40 w-full max-w-[100svw] overflow-hidden border-t border-gray-200 bg-white/95 px-3 pb-[calc(0.7rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {navItems.map((item, index) => {
          const className = `flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-1 text-[0.68rem] font-bold min-[390px]:text-[0.72rem] ${
              index === 0 ? "text-rose-600" : "text-gray-500"
            }`;
          const content = (
            <>
              <item.icon
                className={`size-6 min-[390px]:size-7 ${
                  index === 0 ? "stroke-[2.4]" : ""
                }`}
              />
              <span className="truncate">{text(item.label)}</span>
            </>
          );

          return item.href.startsWith("#") ? (
            <a key={item.label} href={item.href} className={className}>
              {content}
            </a>
          ) : (
            <Link key={item.label} to={item.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
