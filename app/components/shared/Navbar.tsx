"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, LayoutDashboard, Settings, LogOut, Shield, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks";
import { useLogoutMutation } from "@/lib/redux/features/auth/authApi";
import { logout as logoutAction } from "@/lib/redux/features/auth/authSlice";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isHomePage = pathname === "/";

  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();

  const isLoggedIn = mounted && !!token;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isHomePage) return;

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

      if (window.scrollY < 100) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

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

    if (!isHomePage) {
      router.push(`/${href}`);
      return;
    }

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

  const handleLogout = async () => {
    setDropdownOpen(false);
    setIsOpen(false);
    try {
      await logoutApi().unwrap();
    } catch {
      // Even if API fails, clear local state
    }
    dispatch(logoutAction());
    router.push("/");
  };

  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";
  const settingsHref = user?.role === "admin" ? "/admin/settings" : "/dashboard/settings";

  return (
    <>
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
        
        {/* Desktop: Auth buttons or User dropdown */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {isLoggedIn ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-[#0D1117] border border-[#1A3155] hover:border-[#3B82F6] rounded-xl px-3 py-2 transition-all"
              >
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-xs">
                    {user?.name ? getInitials(user.name) : "U"}
                  </div>
                )}
                <span className="text-white text-sm font-medium max-w-[120px] truncate">
                  {user?.name || "User"}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-full min-w-[220px] bg-[#0D1117] border border-[#1A3155] rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-[#1A3155]">
                    <p className="text-white text-sm font-medium truncate">{user?.name || "User"}</p>
                    <p className="text-gray-500 text-xs truncate">{user?.email || ""}</p>
                  </div>

                  <div className="py-1.5">
                    <Link
                      href={dashboardHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#1A2332] transition-colors"
                    >
                      {user?.role === "admin" ? (
                        <><Shield className="w-4 h-4" /> Admin Panel</>
                      ) : (
                        <><LayoutDashboard className="w-4 h-4" /> Dashboard</>
                      )}
                    </Link>
                    <Link
                      href={settingsHref}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#1A2332] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-[#1A3155] py-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-400 hover:text-white transition text-sm">
                Login
              </Link>
              <Link href="/register" className="bg-cyan-500 hover:bg-cyan-400 text-white font-medium px-4 lg:px-5 py-2 rounded-lg transition text-sm">
                Get Started
              </Link>
            </>
          )}
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
            <div className="flex flex-col gap-1 pt-4 mt-2 border-t border-zinc-800/50">
              {isLoggedIn ? (
                <>
                  {/* Mobile user info */}
                  <div className="flex items-center gap-3 px-3 py-3">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-semibold text-xs">
                        {user?.name ? getInitials(user.name) : "U"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user?.name || "User"}</p>
                      <p className="text-gray-500 text-xs truncate">{user?.email || ""}</p>
                    </div>
                  </div>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-900/50 text-sm py-3 px-3 rounded-lg transition"
                  >
                    {user?.role === "admin" ? (
                      <><Shield className="w-4 h-4" /> Admin Panel</>
                    ) : (
                      <><LayoutDashboard className="w-4 h-4" /> Dashboard</>
                    )}
                  </Link>
                  <Link
                    href={settingsHref}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-gray-900/50 text-sm py-3 px-3 rounded-lg transition"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 text-sm py-3 px-3 rounded-lg transition w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-400 hover:text-white transition text-sm text-left py-2 px-3" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="bg-cyan-500 hover:bg-cyan-400 text-white font-medium px-4 py-3 rounded-lg transition text-sm w-full text-center" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
      </header>
    </>
  );
}
