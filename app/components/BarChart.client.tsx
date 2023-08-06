import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { DashboardElement } from "~/types/dashboard";

import type { ApexOptions } from "apexcharts";

type Props = {
  data: DashboardElement[];
  limit?: number;
  onClick?: (id: string) => void;
};

const VIEW_LIMIT = 4;

export default function BarChart({
  data,
  limit = VIEW_LIMIT,
  onClick = () => null,
}: Props) {
  const [viewAll, setViewAll] = useState(false);
  const [series, setSeries] = useState<ApexOptions["series"]>([]);
  const [options, setOptions] = useState<ApexOptions>({});

  useEffect(() => {
    const displayData = viewAll ? data : data.slice(0, limit);

    setSeries([
      {
        name: "Page Views",
        data: displayData.map(({ count, label }) => ({ x: label, y: count })),
      },
    ]);

    setOptions({
      chart: {
        type: "bar",
        height:
          55 *
            (viewAll || displayData.length < limit
              ? displayData.length
              : limit) +
          55,
        offsetX: -25,
        offsetY: -25,
        toolbar: {
          show: true,
          offsetX: -30,
          offsetY: -23,
        },
        events: {
          click(_: never, __: never, config: { dataPointIndex: number }) {
            onClick(data[config.dataPointIndex].id);
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
      tooltip: {
        y: {
          formatter(val: number) {
            return String(Math.round(val));
          },
        },
      },
      xaxis: {
        categories: displayData.map(({ label }) => label),
        axisBorder: {
          show: true,
          color: "#1e293b",
        },
        axisTicks: {
          show: false,
        },
        labels: {
          formatter(val: string) {
            return String(Math.round(Number(val)));
          },
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
    });
  }, [viewAll, data, limit]);

  return (
    <div className="relative">
      <ReactApexChart
        options={options}
        series={series}
        type={"bar"}
        height={options.chart?.height || 350}
      />
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
