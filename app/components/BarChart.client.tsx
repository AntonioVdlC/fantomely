import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import type { DashboardElement } from "~/types/dashboard";

type Props = {
  data: DashboardElement[];
  limit?: number;
};

const VIEW_LIMIT = 4;

export default function BarChart({ data, limit = VIEW_LIMIT }: Props) {
  const [viewAll, setViewAll] = useState(false);
  const chartContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data.length) return;

    const max = data[0].count;
    const plot = Plot.plot({
      height: 55 * (1 + (viewAll || data.length < limit ? data.length : limit)),
      x: { axis: "top", label: null },
      y: { axis: null, inset: 6 },
      marks: [
        Plot.barX(viewAll ? data : data.slice(0, VIEW_LIMIT), {
          x: "count",
          y: "label",
          fill: "steelblue",
          sort: { y: "-x" },
        }),
        Plot.text(viewAll ? data : data.slice(0, VIEW_LIMIT), {
          x: "count",
          y: "label",
          text: (d) => d.label,
          textAnchor: "end",
          dx: -30,
          filter: (d) => d.count / max > 0.5,
          fill: "white",
        }),
        Plot.text(viewAll ? data : data.slice(0, VIEW_LIMIT), {
          x: "count",
          y: "label",
          text: (d) => d.label,
          textAnchor: "start",
          dx: 3,
          filter: (d) => d.count / max <= 0.5,
          fill: "currentColor",
        }),
      ],
    });
    chartContainer.current?.append(plot);
    return () => plot.remove();
  }, [data, viewAll]);

  if (!data.length) {
    return (
      <div className="mt-1">
        <p>No data.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={chartContainer}></div>
      {data.length > limit ? (
        <div className="absolute right-[70px] top-[-20px] text-xs text-slate-500 hover:text-slate-400">
          <a onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "View Less" : "View More"}
          </a>
        </div>
      ) : null}
    </div>
  );
}
