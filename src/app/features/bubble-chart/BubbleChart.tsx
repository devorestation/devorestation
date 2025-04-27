import { useContainerDimensions } from "@/app/lib/useContainerDimensions";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { isDeepStrictEqual } from "node:util";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bubble } from "react-chartjs-2";
import equal from "deep-equal";
import { useAppSelector } from "@/lib/hooks";
import { selectDME } from "@/lib/reforestation.slice";
import { useHoverState } from "@/app/hover.contex";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

function overlaps(bubbles, x, y, r) {
  return bubbles.some((b) => {
    const dx = b.x - x;
    const dy = b.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < b.r + r + 2; // +2 for a little extra padding
  });
}

function addBubble(bubbles, width, height, r) {
  console.log(r);

  let x, y;
  let tries = 0;
  do {
    x = Math.random() * (width - 2 * r) + r;
    y = Math.random() * (height - 2 * r) + r;
    tries++;
    if (tries > 500) {
      console.warn("Couldn't place all bubbles without overlap");
      break;
    }
  } while (overlaps(bubbles, x, y, r));

  if (tries <= 500) {
    bubbles.push({ x, y, r });
  }

  return bubbles;
}

function generateNonOverlappingBubbles(
  count,
  width,
  height,
  minRadius,
  maxRadius
) {
  let bubbles = [];

  for (let i = 0; i < count; i++) {
    const r = Math.random() * (maxRadius - minRadius) + minRadius;
    bubbles = addBubble(bubbles, width, height, r);
  }

  return bubbles;
}

function placeNonOverlappingBubbles(data, width, height) {
  let bubbles = [];

  const filtKeys = Object.keys(data).filter((e) => {
    return e !== "id";
  });

  for (let i = 0; i < filtKeys.length; i++) {
    const r = data[filtKeys[i]];

    for (let k = 0; k < r; k++) {
      bubbles = addBubble(bubbles, width, height, parseInt(filtKeys[i]) / 10);
    }
  }

  return bubbles;
}

export default function BubbleChart(props) {
  const { data } = props;
  const bubbleWrapperRef = useRef(null);
  const { width, height } = useContainerDimensions(bubbleWrapperRef);
  const [localData, setLocalData] = useState(data);
  const chartRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(null);
  const [chartHeight, setChartHeight] = useState(null);

  const dme = useAppSelector(selectDME);

  const prevDataRef = useRef({});
  useEffect(() => {
    const chart = chartRef.current;
    const chartWidth = chart != null ? chart.chartArea.width : 0;
    const chartHeight = chart != null ? chart.chartArea.height : 0;

    setChartWidth(chartWidth);
    setChartHeight(chartHeight);
    if (!equal(prevDataRef.current, data)) {
      setLocalData(placeNonOverlappingBubbles(data, chartWidth, chartHeight));
      prevDataRef.current = data;
    }
  }, [width, height, data]);

  const hoverState = useHoverState();

  return (
    <>
      <div ref={bubbleWrapperRef} className="size-full">
        {data != null && (
          <Bubble
            key={"testBubble"}
            ref={chartRef}
            width={width}
            height={height}
            options={{
              onHover(event, elements, chart) {
                if (elements.length > 0) {
                  const hovVal = elements[0].element["$context"].raw.r;
                  if (hovVal !== hoverState?.hovered?.value) {
                    hoverState?.updateHover({
                      value: hovVal,
                      origin: "bubblechart",
                    });
                  }
                } else {
                  if (null != hoverState?.hovered?.value) {
                    hoverState?.updateHover({
                      value: null,
                      origin: null,
                    });
                  }
                }
              },
              layout: {
                padding: 0,
              },
              redraw: true,
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: chartHeight,
                },
                x: {
                  min: 0,
                  max: chartWidth,
                },
              },
            }}
            data={{
              datasets: [
                {
                  label: "Red dataset",
                  data: localData,
                  backgroundColor: (d) => {
                    if (hoverState?.hovered != null) {
                      if (d.raw != null) {
                        if (d.raw.r === hoverState.hovered.value) {
                          return "rgba(0, 255, 0, 0.5)";
                        }
                      }
                    }

                    if (dme != null && d.raw != null) {
                      if (d.raw.r * 10 >= dme) {
                        return "rgba(99, 132, 255, 0.5)";
                      } else {
                        return "rgba(255, 99, 132, 0.5)";
                      }
                    }
                    return "rgba(255, 99, 132, 0.5)";
                  },
                },
              ],
            }}
          />
        )}
      </div>
    </>
  );
}

export function MyComponent({ data }) {
  const [localData, setLocalData] = useState(data);

  const prevDataRef = useRef(data);

  useEffect(() => {
    if (!equal(prevDataRef.current, data)) {
      console.log("DIFF", prevDataRef.current, data);

      setLocalData(data);
      prevDataRef.current = data;
    }
  }, [data]);

  return (
    <div>
      <pre>{JSON.stringify(localData, null, 2)}</pre>
    </div>
  );
}
