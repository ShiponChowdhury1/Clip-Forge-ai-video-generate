import {
  Navbar,
  Hero,
  VideoSection,
  Features,
  HowItWorks,
  Pricing,
  FAQ,
  Footer,
} from "./components";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <VideoSection />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
