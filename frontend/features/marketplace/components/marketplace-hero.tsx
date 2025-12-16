"use client";

export function MarketplaceHero() {
  return (
    <section className="mb-12 rounded-3xl border border-[#F5B700]/20 bg-gradient-to-br from-background via-background to-muted/20 p-10 shadow-2xl shadow-[#F5B700]/5 backdrop-blur">
      <span className="inline-flex rounded-full bg-[#F5B700]/10 px-4 py-1 text-xs font-semibold text-[#F5B700]">
        ZIPHER CAMPUS · ENCRYPTED MARKETPLACE
      </span>

      <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
        <span className="bg-gradient-to-r from-[#F5B700] to-[#FF6A00] bg-clip-text text-transparent">
          Encrypted Learning Spaces
        </span>
      </h1>

      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        Discover paid, privacy-first learning communities secured by Zama FHE
        and on-chain access control. Content, analytics, and membership status
        remain encrypted by default.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="rounded-xl bg-gradient-to-r from-[#F5B700] to-[#FF6A00] px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-[#F5B700]/20">
          Paid · Encrypted · On-Chain
        </div>

        <p className="text-sm text-muted-foreground">
          Only verified encrypted spaces appear here
        </p>
      </div>
    </section>
  );
}
