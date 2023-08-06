import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { DashboardElement } from "~/types/dashboard";

type Props = {
  data: Omit<DashboardElement, "id">[];
};

export default function TimeSeriesChart({ data }: Props) {
  const [series, setSeries] = useState<ApexOptions["series"]>([]);
  const [options, setOptions] = useState<ApexOptions>({});

  useEffect(() => {
    const seriesData = data.map(({ count, label }) => [
      new Date(label).getTime(),
      count,
    ]);

    setSeries([
      {
        name: "Page Views",
        data: seriesData,
      },
    ]);

    setOptions({
      chart: {
        id: "chart2",
        type: "line",
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },
        height: 230,
        offsetX: -10,
        offsetY: 0,
        toolbar: {
          show: true,
          autoSelected: "selection",
        },
      },
      colors: ["#64748b"],
      fill: {
        opacity: 1,
      },
      stroke: {
        width: 3,
        curve: "smooth",
        colors: ["#64748b"],
      },
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      plotOptions: {
        area: {
          fillTo: "origin",
        },
      },
      xaxis: {
        type: "datetime",
        tickAmount: 8,
        labels: {
          formatter(val) {
            return new Date(val).toLocaleDateString(undefined, {
              year: "2-digit",
              month: "short",
              day: "numeric",
            });
          },
        },
        axisBorder: {
          show: true,
          color: "#1e293b",
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        min: 0,
        max: Math.max(...seriesData.map((d) => d[1])) + 1,
        forceNiceScale: true,
        labels: {
          formatter(val) {
            return String(Math.round(val));
          },
        },
        axisBorder: {
          show: true,
          color: "#1e293b",
        },
        axisTicks: {
          show: false,
        },
        tickAmount: 4,
      },
    });
  }, [data]);

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type={options.chart?.type || "line"}
        height={options.chart?.height || 230}
      />
    </div>
  );
}
