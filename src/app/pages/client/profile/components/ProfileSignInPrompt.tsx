import { Link } from "react-router";

export function ProfileSignInPrompt({
  text,
  primaryLabel,
}: {
  text: string;
  primaryLabel: string;
}) {
  return (
    <section className="rounded-[1.5rem] border border-dashed border-gray-200 bg-white p-4 text-center shadow-sm shadow-gray-200/50">
      <p className="mx-auto max-w-md text-sm font-semibold leading-6 text-gray-500">
        {text}
      </p>
      <Link
        to="/client"
        className="mt-4 inline-flex rounded-full bg-gray-950 px-5 py-3 text-sm font-extrabold text-white transition active:scale-[0.98]"
      >
        {primaryLabel}
      </Link>
    </section>
  );
}
