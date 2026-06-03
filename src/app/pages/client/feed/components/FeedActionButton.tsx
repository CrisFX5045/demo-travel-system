import type { ElementType } from "react";

type FeedActionButtonProps = {
  icon: ElementType;
  activeIcon?: ElementType;
  label: string | number;
  isActive?: boolean;
  activeContainerClassName?: string;
  activeIconClassName?: string;
  activeLabelClassName?: string;
  pressable?: boolean;
  onClick?: () => void;
};

export function FeedActionButton({
  icon: Icon,
  activeIcon: ActiveIcon,
  label,
  isActive = false,
  activeContainerClassName = "",
  activeIconClassName = "",
  activeLabelClassName = "",
  pressable = true,
  onClick,
}: FeedActionButtonProps) {
  const DisplayIcon = isActive && ActiveIcon ? ActiveIcon : Icon;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 ${
        pressable
          ? "cursor-pointer transition-transform duration-100 hover:scale-105 active:scale-[0.98]"
          : "cursor-default"
      }`}
    >
      <span
        className={`grid size-12 place-items-center rounded-full text-gray-950 shadow-lg transition-transform duration-150 dark:text-white ${
          isActive && activeContainerClassName
            ? activeContainerClassName
            : "bg-white/90 dark:bg-black/45"
        }`}
      >
        <DisplayIcon
          className={`size-7 transition-colors duration-200 ${
            isActive ? activeIconClassName : ""
          }`}
        />
      </span>
      <span
        className={`text-xs font-bold text-white drop-shadow transition-colors duration-200 dark:text-white ${
          isActive ? activeLabelClassName : ""
        }`}
      >
        {label}
      </span>
    </button>
  );
}
