import { BarGroup, BarSeries, XYChart } from "@visx/xychart";
import { useState } from "react";
import type { DashboardElement } from "~/types/dashboard";

type Props = {
  data: DashboardElement[];
  dataKey: string;
  limit?: number;
};

const VIEW_LIMIT = 4;

export default function BarChart({ data, dataKey, limit = VIEW_LIMIT }: Props) {
  const [viewAll, setViewAll] = useState(false);

  const height =
    55 * (1 + (viewAll || data.length < limit ? data.length : limit));

  const accessors = {
    xAccessor: (datum: DashboardElement) => datum.count,
    yAccessor: (datum: DashboardElement) => datum.label,
  };

  if (!data.length) {
    return (
      <div className="mt-1">
        <p>No data.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <XYChart
        height={height}
        xScale={{ type: "linear" }}
        yScale={{ type: "band" }}
      >
        <BarGroup>
          <BarSeries
            dataKey={dataKey}
            data={viewAll ? data : data.slice(0, limit)}
            {...accessors}
          ></BarSeries>
        </BarGroup>
      </XYChart>
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
