import ReactApexChart from "react-apexcharts";

export default function LineChart({ data }: { data: number[][] }) {
  const series = [
    {
      data,
    },
  ];
  const options = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 350,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },
    xaxis: {
      type: "datetime",
      min: data[0][0],
      tickAmount: 6,
      labels: {
        formatter: function (_: never, timestamp: number) {
          const date = new Date(new Date(timestamp).setHours(0, 0, 0, 0));
          return date.toLocaleDateString(undefined, {
            weekday: "short",
            year: "2-digit",
            month: "short",
            day: "numeric",
          });
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 100],
      },
    },
  };

  return (
    <div id="chart">
      <div id="chart-timeline">
        <ReactApexChart
          // @ts-ignore
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
}
