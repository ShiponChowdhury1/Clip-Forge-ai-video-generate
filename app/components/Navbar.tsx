"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full h-16 md:h-20 border-b border-zinc-800/50 sticky top-0 z-50 bg-black/95 backdrop-blur-md">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-12 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Clipforge Logo"
            width={48}
            height={48}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
          />
          <span className="text-base sm:text-lg font-semibold text-white">Clipforge</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <a href="#features" className="text-gray-400 hover:text-white transition text-sm">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-400 hover:text-white transition text-sm">
            How it Works
          </a>
          <a href="#pricing" className="text-gray-400 hover:text-white transition text-sm">
            Pricing
          </a>
          <a href="#faq" className="text-gray-400 hover:text-white transition text-sm">
            FAQ
          </a>
        </nav>
        
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <button className="text-gray-400 hover:text-white transition text-sm">
            Login
          </button>
          <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-4 lg:px-5 py-2 rounded-lg transition text-sm">
            Get Started
          </button>
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
            <a href="#features" className="text-gray-400 hover:text-white hover:bg-gray-900/50 transition text-sm py-3 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white hover:bg-gray-900/50 transition text-sm py-3 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
              How it Works
            </a>
            <a href="#pricing" className="text-gray-400 hover:text-white hover:bg-gray-900/50 transition text-sm py-3 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
              Pricing
            </a>
            <a href="#faq" className="text-gray-400 hover:text-white hover:bg-gray-900/50 transition text-sm py-3 px-3 rounded-lg" onClick={() => setIsOpen(false)}>
              FAQ
            </a>
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-zinc-800/50">
              <button className="text-gray-400 hover:text-white transition text-sm text-left py-2 px-3">
                Login
              </button>
              <button className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium px-4 py-3 rounded-lg transition text-sm w-full">
                Get Started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
