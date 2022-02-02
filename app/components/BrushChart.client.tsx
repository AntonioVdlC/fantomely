import { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function BrushChart({ data }: { data: number[][] }) {
  const [state] = useState({
    series: [
      {
        data: data,
      },
    ],
    options: {
      chart: {
        id: "chart2",
        type: "line",
        height: 230,
        toolbar: {
          autoSelected: "pan",
          show: false,
        },
      },
      colors: ["#546E7A"],
      stroke: {
        width: 3,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        opacity: 1,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
        min: data[0][0],
        tickAmount: 5,
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
        min: 0,
        max: Math.max(...data.map((d) => d[1])) + 1,
      },
    },

    seriesLine: [
      {
        data: data,
      },
    ],
    optionsLine: {
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
          xaxis: {
            min: data[0][0],
            max: data[data.length - 1][0],
          },
        },
      },
      colors: ["#008FFB"],
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
        min: 0,
        max: Math.max(...data.map((d) => d[1])) + 1,
        tickAmount: 2,
      },
    },
  });

  return (
    <div id="wrapper">
      <div id="chart-line2">
        <ReactApexChart
          // @ts-ignore
          options={state.options}
          series={state.series}
          type="line"
          height={230}
        />
      </div>
      <div id="chart-line">
        <ReactApexChart
          // @ts-ignore
          options={state.optionsLine}
          series={state.seriesLine}
          type="area"
          height={130}
        />
      </div>
    </div>
  );
}
