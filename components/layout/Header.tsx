import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50">
      {/* TOP BAR */}
      <div className="bg-[#f7cfd8] text-[#7a4a58] text-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 lg:px-10">

          <p className="flex items-center gap-2 font-medium">
            <span className="text-xs">♥</span>
            Bringing a little Southern charm to every clean
          </p>

          <div className="flex items-center gap-3">
            {/* (unchanged social icons) */}
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-[#f1e4e7]/70 shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">

          {/* LOGO */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="font-serif text-xl text-[#2f2928]">
              Maid in Dixie
            </span>
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#c77b95]">
              Cleaning Services
            </span>
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5a514d]">

            {/* ✅ FIXED NAV */}
            <Link href="/" className="hover:text-[#d95f91] transition">
              Home
            </Link>

            <Link href="/#services" className="hover:text-[#d95f91] transition">
              Services
            </Link>

            <Link href="/#pricing" className="hover:text-[#d95f91] transition">
              Pricing
            </Link>

            <Link href="/policies" className="hover:text-[#d95f91] transition">
              Policies
            </Link>

            <Link href="/#gallery" className="hover:text-[#d95f91] transition">
              Gallery
            </Link>

            <Link href="/about" className="hover:text-[#d95f91] transition">
              About Us
            </Link>

            <Link href="/contact" className="hover:text-[#d95f91] transition">
              Contact
            </Link>
          </nav>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center justify-center rounded-md border border-[#e7d3d8] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a5c63] shadow-sm transition hover:border-[#d95f91] hover:text-[#d95f91]"
            >
              Admin
            </Link>

            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-md bg-[#d95f91] px-5 py-2.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_25px_rgba(217,95,145,0.3)] transition hover:-translate-y-0.5 hover:bg-[#c94f82] hover:shadow-[0_18px_40px_rgba(217,95,145,0.4)]"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}