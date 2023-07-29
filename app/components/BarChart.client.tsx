/* eslint-disable @typescript-eslint/ban-ts-comment */

import { BarGroup, BarSeries, XYChart } from "@visx/xychart";
import { useState } from "react";
import type { BarDataPoint, DashboardElement } from "~/types/dashboard";

type Props = {
  data: DashboardElement[];
  dataKey: string;
  limit?: number;
  onClick?: (id: string) => void;
};

const VIEW_LIMIT = 5;

export default function BarChart({
  data,
  dataKey,
  limit = VIEW_LIMIT,
  onClick = () => null,
}: Props) {
  const [viewAll, setViewAll] = useState(false);

  const series: Array<BarDataPoint> = data
    .filter((datum) => datum.count)
    .sort((a, b) => a.count - b.count)
    .map((datum) => ({
      id: datum.id,
      count: datum.count,
      label: String(datum.value),
      // new Date(
      //   new Date(period.value).setHours(0, 0, 0, 0)
      // ).toLocaleDateString(undefined, {
      //   year: "2-digit",
      //   month: "short",
      //   day: "numeric",
      // }),
    }));

  const height =
    55 * (1 + (viewAll || data.length < limit ? data.length : limit));

  const accessors = {
    xAccessor: (datum: BarDataPoint) => datum.count,
    yAccessor: (datum: BarDataPoint) => datum.label,
  };

  return (
    <div className="relative">
      <XYChart
        height={height}
        xScale={{ type: "linear" }}
        yScale={{ type: "band" }}
        onPointerUp={({ datum }) => onClick((datum as BarDataPoint).id)}
      >
        <BarGroup>
          <BarSeries
            dataKey={dataKey}
            data={viewAll ? series : series.slice(0, limit)}
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
