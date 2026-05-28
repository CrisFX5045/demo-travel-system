import { useEffect, useRef, useState } from "react";

export function useScrollChrome() {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [isMobileHeaderVisible, setIsMobileHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (Math.abs(currentScrollY - lastScrollY.current) > 8) {
        const shouldShowChrome = !isScrollingDown || currentScrollY < 80;
        setIsBottomNavVisible(shouldShowChrome);
        setIsMobileHeaderVisible(shouldShowChrome);
        lastScrollY.current = currentScrollY;
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isBottomNavVisible, isMobileHeaderVisible };
}
