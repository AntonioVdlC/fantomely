/* eslint-disable @typescript-eslint/ban-ts-comment */

import ReactApexChart from "react-apexcharts";

type Props = {
  categories: string[];
  data: number[];
  elements: Array<{ id: string }>;
  onClick?: (id: string) => void;
};

export default function BarChart({
  categories,
  data,
  elements,
  onClick = () => null,
}: Props) {
  const options = {
    chart: {
      type: "bar",
      height: 55 * data.length + 55,
      offsetX: -25,
      offsetY: -25,
      toolbar: {
        show: false,
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
      data,
    },
  ];

  return (
    <div>
      {/* @ts-ignore */}
      <ReactApexChart
        options={options}
        series={series}
        type={options.chart.type}
        height={options.chart.height}
      />
    </div>
  );
}
