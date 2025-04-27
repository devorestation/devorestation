import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { selectDME } from "@/lib/reforestation.slice";
import { useHoverState } from "@/app/hover.contex";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart(props) {
  const { data } = props;
  const dme = useAppSelector(selectDME);
  const hoverState = useHoverState();

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Chart.js Bar Chart - Stacked",
      },
    },
    onHover: (e, elements) => {
      const hovVal = elements[0].element["$context"].parsed.x + 1;
      if (hoverState?.hovered?.value !== hovVal) {
        hoverState?.updateHover({ value: hovVal, origin: "barchart" });
      }
    },
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };

  return (
    <Bar
      options={options}
      data={{
        labels: Object.keys(data).filter((e) => e !== "id"),
        datasets: [
          {
            label: "Dataset 1",
            data: Object.values(data),
            backgroundColor: (d) => {
              if (hoverState?.hovered != null) {
                if (d.parsed.x != null) {
                  if (d?.parsed?.x + 1 === hoverState.hovered.value) {
                    return "rgba(0, 255, 0, 0.5)";
                  }
                }
              }

              if (dme != null && d.raw != null) {
                if ((d.parsed.x + 1) * 10 >= dme) {
                  return "rgba(99, 132, 255, 0.5)";
                } else {
                  return "rgba(255, 99, 132, 0.5)";
                }
              }
              return "rgba(255, 99, 132, 0.5)";
            },
            stack: "Stack 0",
          },
        ],
      }}
    />
  );
}
