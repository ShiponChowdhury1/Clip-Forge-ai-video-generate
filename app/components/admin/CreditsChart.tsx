"use client";

import { useEffect, useRef } from "react";

const data = [
  { day: "Mon", value: 3200 },
  { day: "Tue", value: 4800 },
  { day: "Wed", value: 3800 },
  { day: "Thu", value: 4200 },
  { day: "Fri", value: 5500 },
  { day: "Sat", value: 4000 },
  { day: "Sun", value: 2800 },
];

export default function CreditsChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padLeft = 50;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 40;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    const maxVal = 6000;
    const ySteps = [0, 1500, 3000, 4500, 6000];

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Y-axis labels & grid lines
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.strokeStyle = "#1A3155";
    ctx.lineWidth = 0.5;

    ySteps.forEach((val) => {
      const y = padTop + chartH - (val / maxVal) * chartH;
      ctx.fillText(val.toString(), 4, y + 4);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
    });

    // Plot points
    const points = data.map((d, i) => ({
      x: padLeft + (i / (data.length - 1)) * chartW,
      y: padTop + chartH - (d.value / maxVal) * chartH,
    }));

    // Area fill gradient
    const gradient = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    gradient.addColorStop(0, "rgba(0, 200, 255, 0.25)");
    gradient.addColorStop(1, "rgba(0, 200, 255, 0)");

    ctx.beginPath();
    ctx.moveTo(points[0].x, padTop + chartH);
    points.forEach((p, i) => {
      if (i === 0) {
        ctx.lineTo(p.x, p.y);
      } else {
        const prev = points[i - 1];
        const cpx1 = prev.x + (p.x - prev.x) * 0.4;
        const cpx2 = prev.x + (p.x - prev.x) * 0.6;
        ctx.bezierCurveTo(cpx1, prev.y, cpx2, p.y, p.x, p.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, padTop + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        const prev = points[i - 1];
        const cpx1 = prev.x + (p.x - prev.x) * 0.4;
        const cpx2 = prev.x + (p.x - prev.x) * 0.6;
        ctx.bezierCurveTo(cpx1, prev.y, cpx2, p.y, p.x, p.y);
      }
    });
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // X-axis labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      const x = padLeft + (i / (data.length - 1)) * chartW;
      ctx.fillText(d.day, x, h - 10);
    });
  }, []);

  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-semibold text-base sm:text-lg mb-4">Credits Used Over Time</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-[180px] sm:h-[220px]"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
