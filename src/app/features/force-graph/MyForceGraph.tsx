// ForceGraphComponent.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";

const data = {
  nodes: [...Array(100).keys()].map((e, i) => {
    return { id: `Node ${i}`, group: 1 };
  }),
  links: [],
};

const MyForceGraph = () => {
  const fgRef = useRef(null);
  const NODE_R = 8;

  useEffect(() => {
    // You can access methods on the ForceGraph instance if needed
    // e.g. fgRef.current.zoomToFit(400);
  }, []);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const handleNodeHover = (node) => {
    highlightNodes.clear();
    if (node) {
      highlightNodes.add(node);
    }

    setHoverNode(node || null);
    setHighlightNodes(highlightNodes);
  };

  const paintRing = useCallback(
    (node, ctx) => {
      // add ring just for highlighted nodes
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = node === hoverNode ? "red" : "orange";
      ctx.fill();
    },
    [hoverNode]
  );

  return (
    <div className="w-full h-screen">
      <ForceGraph2D
        ref={fgRef}
        graphData={data}
        nodeAutoColorBy="group"
        linkVisibility={false}
        onNodeHover={handleNodeHover}
        nodeCanvasObjectMode={(node) =>
          highlightNodes.has(node) ? "before" : undefined
        }
        nodeCanvasObject={paintRing}
      />
    </div>
  );
};

export default MyForceGraph;
