export default function SectionWave() {
  return (
    <div className="relative w-full overflow-hidden leading-none -mt-16 z-10">
      <svg
        viewBox="0 0 1440 150"
        className="w-full h-[120px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0,80 
             C240,140 480,20 720,60 
             C960,100 1200,140 1440,80 
             L1440,0 
             L0,0 
             Z"
          fill="#e8aab5"
        />
      </svg>
    </div>
  );
}