"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  useEffect(() => {
    // Only run scroll detection on home page
    if (!isHomePage) {
      setActiveSection("");
      return;
    }

    const handleScroll = () => {
      const sections = navLinks.map((link) => link.href.replace("#", ""));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(`#${section}`);
            return;
          }
        }
      }

      // If at the top, no active section
      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Handle hash scrolling when coming from another page
  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const hash = window.location.hash;
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
          setActiveSection(hash);
        }
      }, 100);
    }
  }, [isHomePage]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    // If not on home page, navigate to home with hash
    if (!isHomePage) {
      router.push(`/${href}`);
      return;
    }

    // On home page, smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveSection(href);
    }
  };

  return (
    <>
      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 md:h-20" />
      <header className="w-full h-16 md:h-20 border-b border-zinc-800/50 fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/sidebarLogo.png"
              alt="Clipforge Logo"
              width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
          />
          <span className="text-base sm:text-lg font-semibold text-white">Clipforge</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`relative text-sm transition-colors duration-300 ${
                activeSection === link.href
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.name}
              {/* Underline animation - only active state */}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ease-out ${
                  activeSection === link.href
                    ? "w-full"
                    : "w-0"
                }`}
              />
            </a>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Link href="/login" className="text-gray-400 hover:text-white transition text-sm">
            Login
          </Link>
          <Link href="/register" className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-4 lg:px-5 py-2 rounded-lg transition text-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 -mr-2"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-800/50 bg-black/98 backdrop-blur-md absolute top-16 left-0 right-0 z-50">
          <nav className="flex flex-col px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`transition text-sm py-3 px-3 rounded-lg ${
                  activeSection === link.href
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/50"
                }`}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-zinc-800/50">
              <Link href="/login" className="text-gray-400 hover:text-white transition text-sm text-left py-2 px-3" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-4 py-3 rounded-lg transition text-sm w-full text-center" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
      </header>
    </>
  );
}
