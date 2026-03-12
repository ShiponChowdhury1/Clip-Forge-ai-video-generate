"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#2563EB", "#00d4ff", "#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#22c55e"];

interface PlanDistributionProps {
  plans: { plan_name: string; user_count: number }[];
}

export default function PlanDistribution({ plans }: PlanDistributionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const total = plans.reduce((sum, p) => sum + p.user_count, 0);
  const coloredPlans = plans.map((p, i) => ({ ...p, color: COLORS[i % COLORS.length] }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || coloredPlans.length === 0) return;
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

    coloredPlans.forEach((plan) => {
      const sliceAngle = (plan.user_count / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerR, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = plan.color;
      ctx.fill();
      startAngle += sliceAngle;
    });
  }, [coloredPlans, total]);

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl p-4 sm:p-6">
      <h3 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Plan Distribution</h3>

      <div className="flex justify-center mb-4 sm:mb-6">
        <canvas
          ref={canvasRef}
          className="w-40 h-40 sm:w-50 sm:h-50"
          style={{ width: 200, height: 200 }}
        />
      </div>

      <div className="space-y-2">
        {coloredPlans.map((plan) => (
          <div key={plan.plan_name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: plan.color }}
              />
              <span className="text-gray-700 dark:text-gray-300">{plan.plan_name}</span>
            </div>
            <span className="text-gray-400">{plan.user_count} users</span>
          </div>
        ))}
      </div>
    </div>
  );
}
