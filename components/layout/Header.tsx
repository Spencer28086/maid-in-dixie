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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-10">

          {/* LOGO */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-serif text-lg sm:text-xl text-[#2f2928]">
              Maid in Dixie
            </span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#c77b95]">
              Cleaning Services
            </span>
          </Link>

          {/* NAV (VISIBLE ON MOBILE NOW) */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#5a514d] overflow-x-auto">

            <Link href="/" className="whitespace-nowrap hover:text-[#d95f91]">
              Home
            </Link>

            <Link href="/#services" className="whitespace-nowrap hover:text-[#d95f91]">
              Services
            </Link>

            <Link href="/#pricing" className="whitespace-nowrap hover:text-[#d95f91]">
              Pricing
            </Link>

            <Link href="/policies" className="whitespace-nowrap hover:text-[#d95f91]">
              Policies
            </Link>

            <Link href="/#gallery" className="whitespace-nowrap hover:text-[#d95f91]">
              Gallery
            </Link>

            <Link href="/about" className="whitespace-nowrap hover:text-[#d95f91]">
              About
            </Link>

            <Link href="/contact" className="whitespace-nowrap hover:text-[#d95f91]">
              Contact
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* ADMIN (NOW ALWAYS VISIBLE) */}
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-md border border-[#e7d3d8] bg-white px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#7a5c63] shadow-sm hover:border-[#d95f91] hover:text-[#d95f91]"
            >
              Admin
            </Link>

            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-md bg-[#d95f91] px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-[0.12em] text-white shadow hover:bg-[#c94f82]"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}