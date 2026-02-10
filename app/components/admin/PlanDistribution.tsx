"use client";

import { useEffect, useRef } from "react";

const plans = [
  { name: "Free", users: 400, color: "#2563EB" },
  { name: "Starter", users: 300, color: "#00d4ff" },
  { name: "Pro", users: 200, color: "#0ea5e9" },
  { name: "Enterprise", users: 100, color: "#6366f1" },
];

const total = plans.reduce((sum, p) => sum + p.users, 0);

export default function PlanDistribution() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const outerR = 85;
    const innerR = 60;

    let startAngle = -Math.PI / 2;

    plans.forEach((plan) => {
      const sliceAngle = (plan.users / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = plan.color;
      ctx.fill();
      startAngle += sliceAngle;
    });
  }, []);

  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Plan Distribution</h3>

      <div className="flex justify-center mb-4 sm:mb-6">
        <canvas
          ref={canvasRef}
          className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]"
          style={{ width: 200, height: 200 }}
        />
      </div>

      <div className="space-y-2">
        {plans.map((plan) => (
          <div key={plan.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: plan.color }}
              />
              <span className="text-gray-300">{plan.name}</span>
            </div>
            <span className="text-gray-400">{plan.users} users</span>
          </div>
        ))}
      </div>
    </div>
  );
}
