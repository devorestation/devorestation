import { useContainerDimensions } from "@/app/lib/useContainerDimensions";
import * as d3 from "d3";
import { extent, scaleSqrt } from "d3";
import { useEffect, useRef, useState } from "react";
import { Node } from "./data";

const BUBBLE_MIN_SIZE = 4;
const BUBBLE_MAX_SIZE = 80;

type CirclePackingProps = {
  data: Node[];
};

export const CirclePacking = ({ data }: CirclePackingProps) => {
  const parentRef = useRef(null);
  const dim = useContainerDimensions(parentRef);
  console.log("Dimensions", dim);
  const width = dim.width;
  const height = dim.height;

  // The force simulation mutates nodes, so create a copy first
  // Node positions are initialized by d3
  const nodes: Node[] = data.map((d) => ({ ...d }));

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawTest = (nodes) => {
    console.log("DRAW", nodes[0].x);

    return nodes.map((e, i) => {
      return (
        <circle
          key={`testCircle-${i}`}
          cx={e.x}
          cy={e.y}
          r={sizeScale(e.value)}
          fill="red"
        />
      );
    });
  };

  const [min, max] = extent(nodes.map((d) => d.value)) as [number, number];
  const sizeScale = scaleSqrt()
    .domain([min, max])
    .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE]);

  const [myNodes, setNodes] = useState(nodes);

  useEffect(() => {
    // set dimension of the canvas element
    if (width === 0 || height === 0) {
      return;
    }

    // run d3-force to find the position of nodes on the canvas
    d3.forceSimulation(nodes)

      // list of forces we apply to get node positions
      .force(
        "collide",
        d3.forceCollide().radius((node) => sizeScale(node.value) + 1)
      )
      .force("charge", d3.forceManyBody().strength(80))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("charge", d3.forceY(0).strength(0.05))

      // at each iteration of the simulation, draw the network diagram with the new node positions
      .on("tick", () => {
        /* drawCircles(context, width, height, nodes, sizeScale); */
        setNodes(nodes);
      });
  }, [width, height, nodes, sizeScale]);

  return (
    <div ref={parentRef} className="w-full h-full">
      <svg
        ref={canvasRef}
        style={{
          width,
          height,
        }}
        width={width}
        height={height}
      >
        {drawTest(myNodes)}
      </svg>
    </div>
  );
};
