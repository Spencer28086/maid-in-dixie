import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-serif text-[#4b332c] tracking-tight">
            About Me
          </h1>

          <p className="mt-4 text-2xl text-[#d98aa0] font-medium italic">
            ♥ Hi, I’m Kaylor ♥
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-16 lg:grid-cols-3 items-center">
          
          {/* LEFT IMAGE */}
          <div className="flex justify-center">

            {/* 💎 FIXED IMAGE */}
            <div className="w-full max-w-lg">
              <Image
                src="/images/about/kaylor.png"
                alt="Kaylor - Maid in Dixie"
                width={900}
                height={1200}
                priority
                className="
                  w-full 
                  h-auto 
                  drop-shadow-[0_40px_80px_rgba(183,110,121,0.35)]
                  transition-transform duration-500
                  hover:scale-[1.02]
                "
              />
            </div>

          </div>

          {/* CENTER TEXT */}
          <div className="space-y-6 text-[#4b332c] leading-relaxed">
            <p>
              Hi! My name is Kaylor, and I am the owner of Maid in Dixie Cleaning
              Services. I started this business because I truly enjoy helping
              others and creating clean, comfortable spaces for families to
              enjoy. I take pride in making homes feel fresh, organized, and
              stress-free.
            </p>

            <p>
              Maid in Dixie Cleaning Services is a locally owned business that
              focuses on reliable, detailed cleaning with a personal touch. I
              treat every home as if it were my own and always do my best to make
              sure my clients are happy with the results.
            </p>

            <p>
              I offer everything from basic routine cleanings to deep cleans,
              move-in and move-out cleanings, RV and camper cleanings,
              organization services, holiday decorating, and more. My goal is to
              make life easier for busy families, working parents, elderly
              clients, and anyone who just needs an extra hand around the house.
            </p>

            <p>
              I want my clients to feel comfortable, appreciated, and confident
              when booking with me, and I hope to build long-term relationships
              with the families I work with.
            </p>
          </div>

          {/* RIGHT VALUES */}
          <div className="space-y-6">
            
            <ValueCard
              title="Southern Values"
              text="I believe in honesty, hard work, and treating everyone like family."
            />

            <ValueCard
              title="Attention to Detail"
              text="I pay attention to the little things so you can relax and enjoy your beautiful home."
            />

            <ValueCard
              title="Trust & Reliability"
              text="You can count on me to be on time, professional, and thorough every time."
            />
          </div>
        </div>

        {/* FOOTER MESSAGE */}
        <div className="mt-20 text-center">
          <p className="text-[#d98aa0] text-lg italic">
            ♥ Thank you for supporting my small business. ♥
          </p>
          <p className="text-[#7a6259] mt-2">
            I can’t wait to help make your home shine!
          </p>
        </div>
      </div>
    </main>
  );
}

/* VALUE CARD */
function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[2rem] border border-[#f3d1d8] bg-white/70 p-6 shadow-xl backdrop-blur">
      <h3 className="font-serif text-xl text-[#b76e79] mb-2">
        {title}
      </h3>
      <p className="text-[#4b332c] text-sm leading-relaxed">
        {text}
      </p>
    </div>
  );
}