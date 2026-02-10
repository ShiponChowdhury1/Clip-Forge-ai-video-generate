"use client";

import { useEffect, useRef } from "react";

const data = [
  { day: "Mon", value: 85 },
  { day: "Tue", value: 120 },
  { day: "Wed", value: 140 },
  { day: "Thu", value: 195 },
  { day: "Fri", value: 130 },
  { day: "Sat", value: 260 },
  { day: "Sun", value: 180 },
];

export default function VideosChart() {
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
    const padLeft = 40;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 40;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    const maxVal = 300;
    const ySteps = [0, 65, 130, 195, 260];

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Y-axis labels & grid
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.textAlign = "right";
    ctx.strokeStyle = "#1A3155";
    ctx.lineWidth = 0.5;

    ySteps.forEach((val) => {
      const y = padTop + chartH - (val / maxVal) * chartH;
      ctx.fillText(val.toString(), padLeft - 8, y + 4);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
    });

    // Bars
    const barWidth = chartW / data.length * 0.55;
    const gap = chartW / data.length;

    data.forEach((d, i) => {
      const barH = (d.value / maxVal) * chartH;
      const x = padLeft + i * gap + (gap - barWidth) / 2;
      const y = padTop + chartH - barH;

      // Bar gradient
      const grad = ctx.createLinearGradient(x, y, x, padTop + chartH);
      grad.addColorStop(0, "#00d4ff");
      grad.addColorStop(1, "#0077b6");

      // Rounded top
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + barWidth - radius, y);
      ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
      ctx.lineTo(x + barWidth, padTop + chartH);
      ctx.lineTo(x, padTop + chartH);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    });

    // X-axis labels
    ctx.fillStyle = "#6b7280";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      const x = padLeft + i * gap + gap / 2;
      ctx.fillText(d.day, x, h - 10);
    });
  }, []);

  return (
    <div className="bg-[#0D1117] border border-[#1A3155] rounded-xl p-4 sm:p-6">
      <h3 className="text-white font-semibold text-base sm:text-lg mb-4">Videos Generated</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-[180px] sm:h-[220px]"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}
