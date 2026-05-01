import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="bg-[#f7cfd8] text-[#7a4a58] text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-10">
          <p className="flex items-center gap-2 font-medium text-xs sm:text-sm">
            <span className="text-xs">♥</span>
            Bringing a little Southern charm to every clean
          </p>

          <div className="flex items-center gap-3">
            {/* social icons */}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-[#f1e4e7]/70 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

        {/* MOBILE + DESKTOP RESPONSIVE CONTAINER */}
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-10">

          {/* ROW 1: LOGO + BUTTONS */}
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <Link href="/" className="flex flex-col leading-tight">
              <span className="font-serif text-lg sm:text-xl text-[#2f2928]">
                Maid in Dixie
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#c77b95]">
                Cleaning Services
              </span>
            </Link>

            {/* BUTTONS */}
            <div className="flex items-center gap-2">

              <Link
                href="/admin"
                className="rounded-md border border-[#e7d3d8] bg-white px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#7a5c63] shadow-sm hover:border-[#d95f91] hover:text-[#d95f91]"
              >
                Admin
              </Link>

              <Link
                href="/booking"
                className="rounded-md bg-[#d95f91] px-3 py-1.5 text-[10px] sm:text-sm font-bold uppercase tracking-[0.12em] text-white shadow hover:bg-[#c94f82]"
              >
                Book
              </Link>

            </div>
          </div>

          {/* ROW 2: NAV (WRAPS CLEANLY) */}
          <nav className="mt-3 flex flex-wrap gap-3 text-xs sm:text-sm font-medium text-[#5a514d]">

            <Link href="/" className="hover:text-[#d95f91]">
              Home
            </Link>

            <Link href="/#services" className="hover:text-[#d95f91]">
              Services
            </Link>

            <Link href="/#pricing" className="hover:text-[#d95f91]">
              Pricing
            </Link>

            <Link href="/policies" className="hover:text-[#d95f91]">
              Policies
            </Link>

            <Link href="/#gallery" className="hover:text-[#d95f91]">
              Gallery
            </Link>

            <Link href="/about" className="hover:text-[#d95f91]">
              About
            </Link>

            <Link href="/contact" className="hover:text-[#d95f91]">
              Contact
            </Link>

          </nav>

        </div>
      </div>
    </header>
  );
}