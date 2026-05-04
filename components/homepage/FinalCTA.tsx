export default function FinalCTA() {
  return (
    <section className="relative bg-[#fff1f4] py-32 px-6 overflow-hidden">

      {/* COWGIRL */}
      <img
        src="/cowgirl.png"
        className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 w-[300px] opacity-80 hidden lg:block"
        alt=""
      />

      {/* Background glow */}
      <div className="absolute -top-24 left-0 w-[400px] h-[400px] bg-[#f7d6dc]/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#e8cfc3]/40 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto text-center">

        {/* Heading */}
        <p className="text-[#e8aab5] tracking-[0.4em] uppercase text-sm mb-3">
          Let’s Get Started
        </p>

        <h2 className="text-4xl sm:text-5xl font-serif text-[#4b332c] leading-tight">
          Come Home to Something Beautiful
        </h2>

        {/* Subtext */}
        <p className="mt-6 text-lg text-[#7a6259] max-w-2xl mx-auto leading-8">
          Life gets busy. Let us take care of the cleaning so you can enjoy a calm,
          fresh, and welcoming home—without the stress.
        </p>

        {/* Elegant divider */}
        <div className="mt-10 flex justify-center">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#e8aab5] to-transparent" />
        </div>

        {/* (Buttons removed intentionally) */}
        <div className="mt-12" />

        {/* Trust Signals */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-[#a1847c]">

          <span>✔ Trusted & Reliable</span>
          <span>✔ Attention to Detail</span>
          <span>✔ Satisfaction Focused</span>

        </div>

        {/* Soft reassurance */}
        <p className="mt-6 text-sm text-[#a1847c] italic">
          Your home is treated with the same care as our own.
        </p>

      </div>
    </section>
  );
}