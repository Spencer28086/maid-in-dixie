import { Sparkles, HeartHandshake, CalendarCheck, ShieldCheck, Home } from "lucide-react";

export default function FeatureRow() {
  const features = [
    {
      icon: Sparkles,
      title: "Detailed & Dependable",
      desc: "Every corner cared for with precision and pride.",
    },
    {
      icon: HeartHandshake,
      title: "Southern Hospitality",
      desc: "Warm, friendly service you can feel at home with.",
    },
    {
      icon: CalendarCheck,
      title: "Easy Booking",
      desc: "Simple scheduling with flexible availability.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted & Reliable",
      desc: "Your home is treated with respect and care.",
    },
    {
      icon: Home,
      title: "Stress-Free Living",
      desc: "Come home to comfort, not chores.",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">

      {/* 🌸 Soft pink background wash (slightly deeper for contrast) */}
      <div className="absolute inset-0 bg-[#fbe4eb]" />

      {/* ✨ subtle glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#f7d6dc]/40 blur-3xl rounded-full" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-[#e8aab5] tracking-[0.35em] uppercase text-sm mb-3">
            Why Choose Us
          </p>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#4b332c]">
            Cleaning with Care & Intention
          </h2>
        </div>

        {/* Features */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 text-center">

          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <div
                key={i}
                className="group relative flex flex-col items-center px-4 transition-all duration-300 hover:-translate-y-2"
              >

                {/* ✨ Glass Icon Bubble (UPDATED HERE) */}
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 backdrop-blur border border-[#e8aab5]/60 shadow-md group-hover:shadow-xl transition-all duration-300">

                  <Icon
                    size={28}
                    className="text-[#e8aab5] group-hover:scale-110 transition-transform duration-300"
                  />

                </div>

                {/* Title */}
                <h3 className="font-serif text-lg text-[#4b332c] leading-tight">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm text-[#7a6259] max-w-[200px] leading-relaxed">
                  {feature.desc}
                </p>

                {/* ✨ Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none bg-gradient-to-b from-[#f7d6dc]/20 to-transparent blur-xl" />

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}