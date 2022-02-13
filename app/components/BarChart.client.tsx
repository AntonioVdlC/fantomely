/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useState } from "react";
import ReactApexChart from "react-apexcharts";

type Props = {
  categories: string[];
  data: number[];
  elements: Array<{ id: string }>;
  limit?: number;
  onClick?: (id: string) => void;
};

const VIEW_LIMIT = 5;

export default function BarChart({
  categories,
  data,
  elements,
  limit = VIEW_LIMIT,
  onClick = () => null,
}: Props) {
  const [viewAll, setViewAll] = useState(false);

  const options = {
    chart: {
      type: "bar",
      height: 55 * (viewAll || data.length < limit ? data.length : limit) + 55,
      offsetX: -25,
      offsetY: -25,
      toolbar: {
        show: true,
        offsetX: -30,
        offsetY: -23,
      },
      events: {
        click(_: never, __: never, config: { dataPointIndex: number }) {
          onClick(elements[config.dataPointIndex].id);
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        barHeight: "80%",
        dataLabels: {
          position: "bottom",
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#1e293b"],
        fontWeight: 400,
      },
      formatter: function (_: any, opt: any) {
        return opt.w.globals.labels[opt.dataPointIndex];
      },
      offsetX: 10,
      dropShadow: {
        enabled: false,
      },
    },
    colors: ["#e2e8f0"],
    xaxis: {
      categories,
      axisBorder: {
        show: true,
        color: "#1e293b",
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  };

  const series = [
    {
      name: "Page Views",
      data: viewAll ? data : data.slice(0, limit),
    },
  ];

  return (
    <div className="relative">
      {/* @ts-ignore */}
      <ReactApexChart
        options={options}
        series={series}
        type={options.chart.type}
        height={options.chart.height}
      />
      {data.length > limit ? (
        <div className="absolute top-[-20px] right-[70px] text-xs text-slate-500 hover:text-slate-400">
          <a onClick={() => setViewAll(!viewAll)}>
            {viewAll ? "View Less" : "View More"}
          </a>
        </div>
      ) : null}
    </div>
  );
}
