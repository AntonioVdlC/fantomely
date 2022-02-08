/* eslint-disable @typescript-eslint/ban-ts-comment */

import ReactApexChart from "react-apexcharts";

type Props = {
  data: number[][];
};

export default function BrushChart({ data }: Props) {
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
        autoSelected: "selection",
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: false,
          reset: false,
        },
      },
      events: {
        mounted: function (
          _: never,
          { config }: { config: { xaxis: { range: number | undefined } } }
        ) {
          config.xaxis.range = undefined;
        },
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
    tooltip: {
      x: {
        format: "dd MMM yyyy",
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
        color: "#1e293b",
      },
      axisTicks: {
        show: false,
      },
      range,
    },
    yaxis: {
      min: 0,
      max: Math.max(...data.map((d) => d[1])) + 1,
      forceNiceScale: true,
      labels: {
        formatter(val: number) {
          return Math.round(val);
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

  const series = [
    {
      name: "Page Views",
      data: data,
    },
  ];

  return (
    <div>
      <div>
        {/* @ts-ignore */}
        <ReactApexChart
          options={options}
          series={series}
          type={options.chart.type}
          height={options.chart.height}
        />
      </div>
      <div className="-mt-5">
        {/* @ts-ignore */}
        <ReactApexChart
          options={optionsLine}
          series={series}
          type={optionsLine.chart.type}
          height={optionsLine.chart.height}
        />
      </div>
    </div>
  );
}
