import "../styles/globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export const metadata = {
  title: "Maid in Dixie Cleaning Services",
  description: "Luxury cleaning with a Southern touch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative text-[#4b332c] overflow-x-hidden bg-gradient-to-b from-[#fff1f4] via-[#fff8f5] to-[#fff1f4]">

        {/* 🌸 Enhanced global glow layers */}
        <div className="pointer-events-none fixed inset-0 -z-10">

          {/* Top blush wash */}
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#f7d6dc]/50 to-transparent" />

          {/* Floating soft blobs */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#f7d6dc]/40 rounded-full blur-3xl" />
          <div className="absolute top-[30%] right-[-200px] w-[500px] h-[500px] bg-[#e8cfc3]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-[-150px] left-[20%] w-[600px] h-[600px] bg-[#f7d6dc]/30 rounded-full blur-3xl" />

        </div>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="pt-28 relative z-10">
          {children}
        </main>

        {/* Footer */}
        <Footer />

      </body>
    </html>
  );
}