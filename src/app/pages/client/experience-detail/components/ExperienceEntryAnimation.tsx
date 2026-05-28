export function ExperienceEntryAnimation() {
  return (
    <style>
      {`
        @keyframes client-experience-page-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes client-experience-hero-in {
          from {
            opacity: 0;
            transform: scale(1.045);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes client-experience-content-in {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes client-experience-card-in {
          from {
            opacity: 0;
            transform: translateY(22px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes client-expanded-gallery-in {
          from {
            opacity: 0;
            backdrop-filter: blur(0);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(14px);
          }
        }

        @keyframes client-expanded-gallery-out {
          from {
            opacity: 1;
            backdrop-filter: blur(14px);
          }
          to {
            opacity: 0;
            backdrop-filter: blur(0);
          }
        }

        @keyframes client-expanded-image-in {
          from {
            opacity: 0.45;
            transform: scale(0.82);
            border-radius: 1.5rem;
          }
          to {
            opacity: 1;
            transform: scale(1);
            border-radius: 0;
          }
        }

        @keyframes client-expanded-image-out {
          from {
            opacity: 1;
            transform: scale(1);
            border-radius: 0;
          }
          to {
            opacity: 0.35;
            transform: scale(0.86);
            border-radius: 1.5rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [data-client-experience-entry],
          [data-client-experience-entry] *,
          [data-expanded-gallery],
          [data-expanded-gallery] * {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}
    </style>
  );
}
