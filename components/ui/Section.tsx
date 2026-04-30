type SectionProps = {
    title: string;
    children: React.ReactNode;
};

export default function Section({ title, children }: SectionProps) {
    return (
        <div className="bg-white/80 backdrop-blur rounded-[2rem] border border-[#f3d1d8] shadow-xl p-6 md:p-8 space-y-5">

            {/* TITLE */}
            <h2 className="text-xl md:text-2xl font-serif text-[#2b1c1f]">
                {title}
            </h2>

            {/* CONTENT */}
            <div className="space-y-4">
                {children}
            </div>

        </div>
    );
}