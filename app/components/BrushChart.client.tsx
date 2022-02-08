/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function BrushChart({ data }: { data: number[][] }) {
  const range = Math.min(
    7 * 24 * 60 * 60 * 1000,
    data[data.length - 1][0] - data[0][0]
  );

  const options = {
    chart: {
      id: "chart2",
      type: "line",
      height: 230,
      offsetX: -10,
      offsetY: 0,
      toolbar: {
        show: true,
        tools: {
          pan: false,
          reset: false,
        },
      },
      events: {
        mounted: function (ctx: any) {
          // we need to clear the range as we only need it on the iniital load.
          ctx.w.config.xaxis.range = undefined;
        },
      },
    },
    colors: ["#475569"],
    fill: {
      opacity: 1,
    },
    stroke: {
      width: 3,
      curve: "smooth",
      colors: ["#475569"],
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
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM 'yy",
          hour: "",
        },
      },
      axisBorder: {
        show: true,
        color: "#e2e8f0",
      },
      axisTicks: {
        show: false,
      },
      range,
    },
    yaxis: {
      min: 0,
      max: Math.max(...data.map((d) => d[1])) + 1,
    },
  };

  const optionsLine = {
    chart: {
      id: "chart1",
      height: 130,
      type: "area",
      brush: {
        target: "chart2",
        enabled: true,
      },
      selection: {
        enabled: true,
        fill: {
          color: "transparent",
          opacity: 0.1,
        },
        stroke: {
          width: 1,
          dashArray: 3,
          color: "#475569",
          opacity: 0.4,
        },
        xaxis: {
          min: data[0][0],
          max: data[data.length - 1][0],
        },
      },
    },
    colors: ["#0284C7"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
      labels: {
        formatter: function (_: never, timestamp: number) {
          const date = new Date(new Date(timestamp).setHours(0, 0, 0, 0));
          return date.toLocaleDateString(undefined, {
            year: "2-digit",
            month: "short",
            day: "numeric",
          });
        },
      },
    },
    yaxis: {
      show: false,
    },
  };

  const [state] = useState({
    series: [
      {
        name: "Page Views",
        data: data,
      },
    ],
  });

  return (
    <div id="wrapper">
      <div id="chart-line2">
        <ReactApexChart
          // @ts-ignore
          options={options}
          series={state.series}
          type="line"
          height={230}
        />
      </div>
      <div id="chart-line">
        <ReactApexChart
          // @ts-ignore
          options={optionsLine}
          series={state.series}
          type="area"
          height={130}
        />
      </div>
    </div>
  );
}
