import { useState } from "react";
import ApexCharts from "apexcharts";
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
    // annotations: {
    //   yaxis: [
    //     {
    //       y: 30,
    //       borderColor: "#999",
    //       label: {
    //         show: true,
    //         text: "Support",
    //         style: {
    //           color: "#fff",
    //           background: "#00E396",
    //         },
    //       },
    //     },
    //   ],
    //   xaxis: [
    //     {
    //       x: new Date("14 Nov 2012").getTime(),
    //       borderColor: "#999",
    //       yAxisIndex: 0,
    //       label: {
    //         show: true,
    //         text: "Rally",
    //         style: {
    //           color: "#fff",
    //           background: "#775DD0",
    //         },
    //       },
    //     },
    //   ],
    // },
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

  const [selection, setSelection] = useState("one_month");

  const now = new Date().setMinutes(0, 0, 0);
  const oneDayAgo = new Date(new Date().setHours(0, 0, 0, 0)).setDate(
    new Date().getDate() - 1
  );
  const oneWeekAgo = new Date(new Date().setHours(0, 0, 0, 0)).setDate(
    new Date().getDate() - 7
  );
  const oneMonthAgo = new Date(new Date().setHours(0, 0, 0, 0)).setMonth(
    new Date().getMonth() - 1
  );
  const sixMonthsAgo = new Date(new Date().setHours(0, 0, 0, 0)).setMonth(
    new Date().getMonth() - 6
  );
  const oneYearAgo = new Date(new Date().setHours(0, 0, 0, 0)).setFullYear(
    new Date().getFullYear() - 1
  );
  const startYear = new Date(
    new Date(new Date().setHours(0, 0, 0, 0)).setDate(1)
  ).setMonth(0);

  function updateData(timeline: string) {
    setSelection(timeline);

    switch (timeline) {
      case "one_day":
        ApexCharts.exec("area-datetime", "zoomX", oneDayAgo, now);
        break;
      case "one_week":
        ApexCharts.exec("area-datetime", "zoomX", oneWeekAgo, now);
        break;
      case "one_month":
        ApexCharts.exec("area-datetime", "zoomX", oneMonthAgo, now);
        break;
      case "six_months":
        ApexCharts.exec("area-datetime", "zoomX", sixMonthsAgo, now);
        break;
      case "one_year":
        ApexCharts.exec("area-datetime", "zoomX", oneYearAgo, now);
        break;
      case "ytd":
        ApexCharts.exec("area-datetime", "zoomX", startYear, now);
        break;
      case "all":
        ApexCharts.exec("area-datetime", "zoomX", data[0][0], now);
        break;
      default:
    }
  }

  return (
    <div id="chart">
      <div className="toolbar">
        <button
          id="one_day"
          onClick={() => updateData("one_day")}
          className={selection === "one_day" ? "active" : ""}
        >
          1D
        </button>

        <button
          id="one_week"
          onClick={() => updateData("one_week")}
          className={selection === "one_week" ? "active" : ""}
        >
          1W
        </button>

        <button
          id="one_month"
          onClick={() => updateData("one_month")}
          className={selection === "one_month" ? "active" : ""}
        >
          1M
        </button>

        <button
          id="six_months"
          onClick={() => updateData("six_months")}
          className={selection === "six_months" ? "active" : ""}
        >
          6M
        </button>

        <button
          id="one_year"
          onClick={() => updateData("one_year")}
          className={selection === "one_year" ? "active" : ""}
        >
          1Y
        </button>

        <button
          id="ytd"
          onClick={() => updateData("ytd")}
          className={selection === "ytd" ? "active" : ""}
        >
          YTD
        </button>

        <button
          id="all"
          onClick={() => updateData("all")}
          className={selection === "all" ? "active" : ""}
        >
          ALL
        </button>
      </div>

      <div id="chart-timeline">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
}
