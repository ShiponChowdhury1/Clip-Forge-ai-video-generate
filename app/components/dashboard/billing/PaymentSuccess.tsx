"use client";

import { CheckCircle, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function PaymentSuccess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ========================================
    // GSAP CDN LOADING
    // ========================================
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.onload = () => {
      initializeAnimations();
    };
    document.head.appendChild(script);

    const initializeAnimations = () => {
      interface WindowWithGsap extends Window {
        gsap?: {
          timeline: (...args: unknown[]) => unknown;
          to: (...args: unknown[]) => unknown;
          set: (...args: unknown[]) => unknown;
          call: (...args: unknown[]) => unknown;
        };
      }
      const gsapWindow = window as WindowWithGsap;
      if (typeof window === "undefined" || !gsapWindow.gsap) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gsap: any = gsapWindow.gsap;

      // ========================================
      // PARTICLE SYSTEM
      // ========================================
      const particlesContainer = particlesContainerRef.current;
      if (!particlesContainer) return;

      // Particle types and colors for variety
      const particleTypes = [
        { shape: "star", colors: ["#00f7ff", "#00d4ff", "#00a8ff"] },
        { shape: "circle", colors: ["#ff006e", "#ff4d9f", "#ff007f"] },
        { shape: "diamond", colors: ["#00f7ff", "#00ffb3", "#7eff00"] },
        { shape: "sparkle", colors: ["#fff", "#ffd700", "#ffed4e"] },
      ];

      // Create SVG for particle shapes
      const createParticleSVG = (
        type: string,
        color: string
      ): SVGElement => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");

        if (type === "star") {
          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute("fill", color);
          path.setAttribute(
            "d",
            "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          );
          svg.appendChild(path);
        } else if (type === "circle") {
          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
          );
          circle.setAttribute("cx", "12");
          circle.setAttribute("cy", "12");
          circle.setAttribute("r", "12");
          circle.setAttribute("fill", color);
          circle.setAttribute("filter", "url(#glow)");
          svg.appendChild(circle);
        } else if (type === "diamond") {
          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute("fill", color);
          path.setAttribute("d", "M12 2l10 12-10 8-10-8z");
          svg.appendChild(path);
        } else if (type === "sparkle") {
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          const rect1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
          rect1.setAttribute("x", "10");
          rect1.setAttribute("y", "2");
          rect1.setAttribute("width", "4");
          rect1.setAttribute("height", "20");
          rect1.setAttribute("fill", color);

          const rect2 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "rect"
          );
          rect2.setAttribute("x", "2");
          rect2.setAttribute("y", "10");
          rect2.setAttribute("width", "20");
          rect2.setAttribute("height", "4");
          rect2.setAttribute("fill", color);

          g.appendChild(rect1);
          g.appendChild(rect2);
          svg.appendChild(g);
        }

        return svg;
      };

      // Create individual particle
      const createParticle = (): HTMLDivElement => {
        const particle = document.createElement("div");
        const typeIndex = Math.floor(Math.random() * particleTypes.length);
        const particleType = particleTypes[typeIndex];
        const colorIndex = Math.floor(
          Math.random() * particleType.colors.length
        );
        const color = particleType.colors[colorIndex];
        const size = Math.random() * 20 + 8; // 8-28px

        particle.style.position = "fixed";
        particle.style.left = Math.random() * window.innerWidth + "px";
        particle.style.top = "-30px";
        particle.style.pointerEvents = "none";
        particle.style.filter =
          "drop-shadow(0 0 8px " + color + ") drop-shadow(0 0 4px " + color +
          ")";
        particle.style.opacity = "1";
        particle.style.zIndex = "50";

        // Create SVG element for particle
        const svgContainer = document.createElement("div");
        svgContainer.style.width = size + "px";
        svgContainer.style.height = size + "px";
        svgContainer.appendChild(
          createParticleSVG(particleType.shape, color)
        );
        particle.appendChild(svgContainer);

        particlesContainer.appendChild(particle);

        return particle;
      };

      // Animate particle fall
      const animateParticleFall = (particle: HTMLDivElement): void => {
        const duration = Math.random() * 2 + 2; // 2-4 seconds
        const drift = (Math.random() - 0.5) * 200; // Wind effect
        const spin = Math.random() > 0.5 ? 1 : -1;

        gsap.timeline()
          .to(
            particle,
            {
              y: window.innerHeight + 50,
              x: drift,
              opacity: 0,
              rotation: spin * (Math.random() * 720 + 360),
              duration: duration,
              ease: "power1.inOut",
            },
            0
          )
          .call(
            () => {
              particle.remove();
            },
            [],
            duration
          );
      };

      // Particle emitter - continuous creation
      const emitParticles = (): void => {
        setInterval(() => {
          const particlesPerBurst = Math.random() > 0.6 ? 3 : 2;
          for (let i = 0; i < particlesPerBurst; i++) {
            const particle = createParticle();
            setTimeout(
              () => {
                animateParticleFall(particle);
              },
              i * 100
            );
          }
        }, 300);
      };

      // ========================================
      // BURST ANIMATION (Behind success icon)
      // ========================================
      const createBurst = (): void => {
        const burstParticles = 12;
        const burst = document.createElement("div");
        burst.style.position = "fixed";
        burst.style.width = "200px";
        burst.style.height = "200px";
        burst.style.top = "50%";
        burst.style.left = "50%";
        burst.style.transform = "translate(-50%, -50%)";
        burst.style.pointerEvents = "none";
        burst.style.zIndex = "40";
        document.body.appendChild(burst);

        for (let i = 0; i < burstParticles; i++) {
          const angle = (i / burstParticles) * Math.PI * 2;
          const burstElement = document.createElement("div");
          burstElement.style.position = "absolute";
          burstElement.style.width = "3px";
          burstElement.style.height = "3px";
          burstElement.style.background = `hsl(${Math.random() * 60 + 180}, 100%, 50%)`;
          burstElement.style.borderRadius = "50%";
          burstElement.style.left = "50%";
          burstElement.style.top = "50%";
          burstElement.style.boxShadow = `0 0 10px ${burstElement.style.background}`;
          burstElement.style.transform = `translate(-50%, -50%)`;
          burst.appendChild(burstElement);

          gsap.to(burstElement, {
            x: Math.cos(angle) * 100,
            y: Math.sin(angle) * 100,
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            ease: "power2.out",
          });
        }

        setTimeout(() => burst.remove(), 1000);
      };

      // ========================================
      // ENTRANCE ANIMATIONS
      // ========================================
      const successIcon = document.querySelector("#success-icon");
      const successTitle = document.querySelector("#success-title");
      const successCard = document.querySelector("#success-card");
      const successButton = document.querySelector("#success-button");
      const successText = document.querySelector("#success-text");

      // Timeline for smooth entrance
      const entranceTimeline = gsap.timeline();

      // Success Icon entrance
      if (successIcon) {
        gsap.set(successIcon, { scale: 0, opacity: 0 });
        entranceTimeline.to(
          successIcon,
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.5)",
          },
          0
        );
        // Trigger burst after icon appears
        entranceTimeline.call(
          () => {
            createBurst();
          },
          [],
          0.2
        );
      }

      // Title entrance
      if (successTitle) {
        gsap.set(successTitle, { y: -20, opacity: 0 });
        entranceTimeline.to(
          successTitle,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          0.3
        );
      }

      // Description text entrance
      if (successText) {
        gsap.set(successText, { y: -15, opacity: 0 });
        entranceTimeline.to(
          successText,
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          0.4
        );
      }

      // Card entrance
      if (successCard) {
        gsap.set(successCard, { y: 30, opacity: 0 });
        entranceTimeline.to(
          successCard,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          0.5
        );
      }

      // Button entrance
      if (successButton) {
        gsap.set(successButton, { scale: 0.8, opacity: 0 });
        entranceTimeline.to(
          successButton,
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.2)",
          },
          0.6
        );
      }

      // ========================================
      // BUTTON HOVER ANIMATION
      // ========================================
      if (successButton) {
        successButton.addEventListener("mouseenter", () => {
          gsap.to(successButton, {
            boxShadow:
              "0 0 30px rgba(0, 247, 255, 0.6), 0 0 60px rgba(0, 212, 255, 0.4)",
            duration: 0.3,
            ease: "power2.out",
          });
        });

        successButton.addEventListener("mouseleave", () => {
          gsap.to(successButton, {
            boxShadow:
              "0 0 15px rgba(0, 247, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.1)",
            duration: 0.3,
            ease: "power2.out",
          });
        });
      }

      // ========================================
      // CONTINUOUS FLOATING ANIMATION
      // ========================================
      if (successIcon) {
        gsap.to(successIcon, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // ========================================
      // START PARTICLE EMISSION
      // ========================================
      emitParticles();
    };

    // Cleanup
    return () => {
      const scripts = document.querySelectorAll(
        "script[src*='gsap']"
      );
      scripts.forEach((s) => s.remove());
    };
  }, []);

  return (
    <>
      {/* ====== PARTICLES CONTAINER ====== */}
      <div ref={particlesContainerRef} className="fixed inset-0 pointer-events-none z-50" />

      {/* ====== MAIN CONTAINER ====== */}
      <div
        ref={containerRef}
        className="fixed inset-0 flex items-center justify-center min-h-screen bg-linear-to-br from-black via-gray-900 to-black overflow-hidden"
      >
        <div className="text-center max-w-md w-full px-4 z-60">
          {/* ====== SUCCESS ICON WITH GLOW ====== */}
          <div
            id="success-icon"
            className="flex justify-center mb-6 relative"
          >
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-emerald-500/20 rounded-full blur-3xl scale-150" />

            {/* Main icon circle */}
            <div className="relative w-24 h-24 bg-linear-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* ====== SUCCESS TITLE ====== */}
          <h2
            id="success-title"
            className="text-4xl font-bold bg-linear-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2 tracking-tight"
          >
            Payment Successful! 🎉
          </h2>

          {/* ====== DESCRIPTION TEXT ====== */}
          <p
            id="success-text"
            className="text-gray-400 text-sm mb-8 leading-relaxed"
          >
            Your plan has been updated and credits have been added to your
            account.
          </p>

          {/* ====== INFO CARD ====== */}
          <div
            id="success-card"
            className="bg-linear-to-br from-[#0D1117]/80 to-[#0D1117]/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 mb-8 hover:border-cyan-500/50 transition-all duration-300"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-5 h-5 text-cyan-400">
                <Sparkles className="w-full h-full" />
              </div>
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                Subscription Updated
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your profile, plan, and credit balance have been refreshed. Head
              to your settings to view the updated details.
            </p>
          </div>

          {/* ====== CTA BUTTON ====== */}
          <div className="flex items-center justify-center">
            <Link
              id="success-button"
              href="/dashboard/settings"
              className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 cursor-pointer active:scale-95 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Settings className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Go to Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
