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
        pressable ? "transition-transform duration-100 active:scale-[0.98]" : ""
      }`}
    >
      <span
        className={`grid size-12 place-items-center rounded-full shadow-lg transition-transform duration-150 ${
          isActive && activeContainerClassName
            ? activeContainerClassName
            : "bg-black/45"
        }`}
      >
        <DisplayIcon
          className={`size-7 transition-colors duration-200 ${
            isActive ? activeIconClassName : ""
          }`}
        />
      </span>
      <span
        className={`text-xs font-bold transition-colors duration-200 ${
          isActive ? activeLabelClassName : ""
        }`}
      >
        {label}
      </span>
    </button>
  );
}
