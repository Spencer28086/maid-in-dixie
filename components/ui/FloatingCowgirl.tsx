"use client";

export default function FloatingCowgirl() {
    return (
        <>
            {/* MOBILE: INSIDE HERO */}
            <div className="pointer-events-none absolute left-2 bottom-0 z-20 block lg:hidden">
                <img
                    src="/images/cowgirl.png"
                    alt=""
                    className="
            w-[85px]
            sm:w-[100px]
            drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]
          "
                />
            </div>

            {/* DESKTOP: FLOATING */}
            <div className="pointer-events-none fixed left-0 bottom-0 z-[9999] hidden lg:block">
                <img
                    src="/images/cowgirl.png"
                    alt=""
                    className="
            w-[260px]
            xl:w-[320px]
            drop-shadow-[0_25px_50px_rgba(0,0,0,0.2)]
          "
                />
            </div>
        </>
    );
}