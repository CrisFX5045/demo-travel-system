import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export function CompanyNotFound({
  backLabel,
  title,
  hint,
  onBack,
}: {
  backLabel: string;
  title: string;
  hint: string;
  onBack: () => void;
}) {
  return (
    <main className="min-h-screen bg-white px-4 py-8 text-gray-950">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-extrabold"
      >
        <ArrowLeftIcon className="size-4" />
        {backLabel}
      </button>
      <section className="mx-auto mt-20 max-w-md text-center">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="mt-2 text-gray-500">{hint}</p>
      </section>
    </main>
  );
}
