import { Navbar, Footer } from "@/app/components";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}
