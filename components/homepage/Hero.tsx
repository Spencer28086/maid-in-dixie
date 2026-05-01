import Image from "next/image";
import Link from "next/link";
import FloatingCowgirl from "@/components/ui/FloatingCowgirl";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fff7f8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,214,224,0.92),transparent_38%),linear-gradient(90deg,rgba(255,248,249,0.98)_0%,rgba(255,248,249,0.9)_45%,rgba(255,248,249,0.2)_70%)] z-10" />

      <div className="relative min-h-[650px] lg:min-h-[720px]">
        <Image
          src="/images/home/hero-southern-porch.jpg"
          alt="A bright Southern porch with pink flowers and a welcoming clean home entryway"
          fill
          priority
          className="object-cover object-center"
        />

        <div className="relative z-20 mx-auto flex min-h-[650px] max-w-7xl items-center px-6 py-20 lg:min-h-[720px] lg:px-10">
          <div className="max-w-[560px]">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#efbdd0] bg-white/75 px-4 py-2 text-sm font-medium text-[#c65d88] shadow-sm backdrop-blur">
              <span className="text-[#dc7fa3] text-xs">♥</span>
              Southern charm in every clean
            </div>

            <h1 className="font-serif text-[3.35rem] leading-[0.98] tracking-[-0.04em] text-[#2f2928] sm:text-[4.6rem] lg:text-[5.35rem]">
              A Clean Home
            </h1>

            <p className="mt-1 font-serif text-[3.05rem] italic leading-[1] tracking-[-0.05em] text-[#cf5c8a] drop-shadow-[0_2px_8px_rgba(207,92,138,0.25)] sm:text-[4.4rem] lg:text-[5rem]">
              Y’all Will Love
            </p>

            <p className="mt-7 max-w-[420px] text-base leading-8 text-[#5f5551] sm:text-lg">
              Reliable, detailed, and sprinkled with Southern hospitality.
              Maid in Dixie Cleaning Services brings the charm back to your
              home.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-md bg-[#d95f91] px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white hover:shadow-[0_22px_50px_rgba(217,95,145,0.45)] transition hover:-translate-y-0.5 hover:bg-[#c94f82]"
              >
                Book Your Clean
                <span className="ml-2">♥</span>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-md border border-[#ead7d2] bg-white/85 px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-[#3d3532] shadow-[0_14px_30px_rgba(88,61,49,0.1)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#e5abc1]"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[-1px] left-0 right-0 z-30 h-20 bg-[linear-gradient(to_bottom,rgba(255,247,248,0),#fff7f8_78%)]" />
    </section>
  );
}