export default function HowItWorks() {
  return (
    <section className="relative bg-[#fbe4eb] py-28 px-6 overflow-hidden">

      {/* Soft background accents */}
      <div className="absolute -top-20 left-0 w-[350px] h-[350px] bg-[#f7d6dc]/40 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#e8cfc3]/30 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto text-center">

        {/* Header */}
        <p className="text-[#e8aab5] tracking-[0.4em] uppercase text-sm mb-3">
          How It Works
        </p>

        <h2 className="text-4xl sm:text-5xl font-serif text-[#4b332c] leading-tight">
          A Seamless Cleaning Experience
        </h2>

        <p className="mt-4 text-[#e8aab5] italic text-lg">
          From first contact to final sparkle ✨
        </p>

        <p className="mt-3 text-[#7a6259] max-w-2xl mx-auto">
          We’ve designed every step to feel effortless, clear, and beautifully simple.
        </p>

        {/* Steps */}
        <div className="relative mt-20 grid md:grid-cols-3 gap-10 text-left">

          {/* Connector Line (desktop only) */}
          <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-[#f3d1d8] to-transparent" />

          {[
            {
              icon: "💌",
              step: "01",
              title: "Request a Quote",
              desc: "Tell us a little about your home, and we’ll provide a personalized estimate tailored just for you.",
              delay: "0ms"
            },
            {
              icon: "🗓️",
              step: "02",
              title: "Schedule Your Cleaning",
              desc: "Pick a time that fits your life—we’ll handle the details so everything flows smoothly.",
              delay: "150ms"
            },
            {
              icon: "✨",
              step: "03",
              title: "Enjoy Your Home",
              desc: "Walk into a refreshed, peaceful space and experience the comfort of a beautifully cleaned home.",
              delay: "300ms"
            }
          ].map((item, i) => (
            <div
              key={i}
              className="group relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-[#f3d1d8]/80 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 opacity-0 animate-[fadeUp_0.8s_ease_forwards]"
              style={{ animationDelay: item.delay }}
            >

              {/* Large Step Number */}
              <div className="absolute top-6 right-6 text-[64px] font-serif text-[#f3d1d8]/40 pointer-events-none select-none">
                {item.step}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-[#f3d1d8] shadow-sm text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>

              {/* Step Label */}
              <p className="text-xs uppercase tracking-[0.25em] text-[#e8aab5] mb-2">
                Step {item.step}
              </p>

              {/* Title */}
              <h3 className="font-serif text-xl text-[#4b332c] leading-snug">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm text-[#7a6259] leading-6">
                {item.desc}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-br from-[#f7d6dc]/30 via-transparent to-transparent" />
            </div>
          ))}

        </div>
      </div>

      {/* Tailwind-compatible keyframes via global style */}
      <style>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  );
}