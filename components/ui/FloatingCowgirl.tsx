"use client";

export default function FloatingCowgirl() {
    return (
        <div className="pointer-events-none fixed left-0 bottom-0 z-[9999]">

            <img
                src="/images/cowgirl.png"
                alt=""
                className="
          w-[120px]
          sm:w-[160px]
          md:w-[200px]
          lg:w-[260px]
          xl:w-[320px]
          drop-shadow-[0_25px_50px_rgba(0,0,0,0.2)]
        "
            />

        </div>
    );
}