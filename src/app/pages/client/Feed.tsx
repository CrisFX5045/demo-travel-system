import { useNavigate, useSearchParams } from "react-router";

import { FeedHeader, FeedViewport } from "./feed/components";
import { useFeedReactions } from "./feed/hooks/useFeedReactions";
import { useFeedWindow } from "./feed/hooks/useFeedWindow";

export default function ClientFeed() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialExperienceId = searchParams.get("experience");
  const selectedProvince = searchParams.get("province") ?? "";
  const { liked, saved, toggleLiked, toggleSaved } = useFeedReactions();
  const {
    feedItems,
    isLoadingMore,
    trimmedBefore,
    handleActiveIndexChange,
  } = useFeedWindow(initialExperienceId, selectedProvince);

  const leaveFeed = () => {
    navigate("/client");
  };

  return (
    <main
      data-client-feed-entry
      className="h-svh w-full max-w-[100svw] overflow-hidden bg-black text-white [animation:client-feed-page-in_360ms_cubic-bezier(.22,1,.36,1)_both] lg:bg-[#111]"
    >
      <FeedTransitionStyles />
      <FeedHeader
        selectedProvince={selectedProvince}
        onBack={leaveFeed}
        onSelectProvince={(province) => {
          const nextParams = new URLSearchParams(searchParams);

          if (province) {
            nextParams.set("province", province);
            nextParams.delete("experience");
          } else {
            nextParams.delete("province");
          }

          setSearchParams(nextParams, { replace: true });
        }}
      />
      <FeedViewport
        experiences={feedItems}
        isLoadingMore={isLoadingMore}
        initialExperienceId={initialExperienceId}
        liked={liked}
        trimmedBefore={trimmedBefore}
        saved={saved}
        onActiveIndexChange={handleActiveIndexChange}
        onToggleLiked={toggleLiked}
        onToggleSaved={toggleSaved}
      />
    </main>
  );
}

function FeedTransitionStyles() {
  return (
    <style>
      {`
        @keyframes client-feed-page-in {
          from {
            opacity: 0;
            transform: scale(1.01);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes client-feed-header-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-client-feed-entry],
          [data-client-feed-entry] * {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}
    </style>
  );
}
