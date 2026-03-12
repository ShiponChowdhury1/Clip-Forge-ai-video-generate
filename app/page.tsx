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
    <div className="w-full min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white overflow-x-hidden">
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
