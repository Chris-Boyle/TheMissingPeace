export function SiteFooter() {
  return (
    <footer className="border-t border-[#dccfc1] bg-[#f8f1e8]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-[#5f4738] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-base font-semibold text-[#6d4b36]">
            The Missing Peace
          </p>
          <p className="mt-1 text-[#7a6557]">
            Doula care, childbirth education, and postpartum support.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-[#5f4738] lg:items-end">
          <a
            href="mailto:missingpeacekc@gmail.com"
            className="transition hover:text-[#3f2818]"
          >
            missingpeacekc@gmail.com
          </a>
          <a
            href="tel:18167264134"
            className="transition hover:text-[#3f2818]"
          >
            (816) 726-4134
          </a>
        </div>
      </div>
    </footer>
  );
}
