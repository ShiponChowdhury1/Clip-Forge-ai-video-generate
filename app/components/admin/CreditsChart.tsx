"use client";

import { useEffect, useRef } from "react";

interface CreditsChartProps {
  data: { date?: string; day?: string; count: number }[];
  timeFilter?: "all" | "7d" | "30d" | "90d";
}

function formatAxisLabel(rawDate: string | undefined, timeFilter: "all" | "7d" | "30d" | "90d"): string {
  if (!rawDate) return "-";

  const parsed = new Date(rawDate);
  if (!Number.isNaN(parsed.getTime())) {
    if (timeFilter === "7d") {
      return parsed.toLocaleDateString("en-US", { weekday: "short" });
    }
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return rawDate;
}

export default function CreditsChart({ data, timeFilter = "all" }: CreditsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
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

    const maxVal = Math.max(...data.map((d) => d.count), 1);
    const yStepCount = 5;
    const ySteps = Array.from({ length: yStepCount }, (_, i) => Math.round((maxVal / (yStepCount - 1)) * i));

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
      x: padLeft + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2),
      y: padTop + chartH - (d.count / maxVal) * chartH,
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

    const maxLabels = Math.floor(chartW / 65);
    const step = Math.ceil(data.length / maxLabels);

    data.forEach((d, i) => {
      const isStep = i % step === 0;
      const isLast = i === data.length - 1;
      const tooCloseToLast = (data.length - 1 - i) < (step / 2);

      if (step === 1 || (isStep && !tooCloseToLast) || isLast) {
        const x = padLeft + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2);
        const label = formatAxisLabel(d.date ?? d.day, timeFilter);
        ctx.fillText(label, x, h - 10);
      }
    });
  }, [data, timeFilter]);

  return (
    <div className="bg-white dark:bg-[#0D1117] border border-gray-300 dark:border-[#1A3155] rounded-xl p-6">
      <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-4">Credits Used Over Time</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-[220px]"
        style={{ width: "100%", height: 220 }}
      />
    </div>
  );
}
