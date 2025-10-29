// src/app/analysis/components/BehaviorChart.jsx
"use client";
import { useState, useEffect, useMemo, useRef } from "react";

const BehaviorChart = ({ transitions }) => {
  const edges = transitions ?? [];
  const [positionedNodes, setPositionedNodes] = useState([]);
  const [svgDimensions, setSvgDimensions] = useState({ width: 1000, height: 700 });
  const [hiddenNodes, setHiddenNodes] = useState(() => new Set());
  const [draggedNodeName, setDraggedNodeName] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isSimulating, setIsSimulating] = useState(false);
  const svgRef = useRef(null);
  const animationRef = useRef(null);

  const nodes = useMemo(() => {
    if (!edges.length) return [];
    return Array.from(new Set(edges.flatMap((item) => [item.from, item.to])));
  }, [edges]);

  const nodeScores = useMemo(() => {
    if (!edges.length) return {};
    return edges.reduce((acc, edge) => {
      const value = Math.abs(edge.z ?? 0);
      acc[edge.from] = Math.max(acc[edge.from] ?? Number.NEGATIVE_INFINITY, value);
      acc[edge.to] = Math.max(acc[edge.to] ?? Number.NEGATIVE_INFINITY, value);
      return acc;
    }, {});
  }, [edges]);

  const sortedNodes = useMemo(() => {
    if (!nodes.length) return [];
    return [...nodes].sort((a, b) => {
      const scoreDiff = (nodeScores[b] ?? Number.NEGATIVE_INFINITY) - (nodeScores[a] ?? Number.NEGATIVE_INFINITY);
      if (scoreDiff !== 0) return scoreDiff;
      return a.localeCompare(b);
    });
  }, [nodes, nodeScores]);

  const visibleNodes = useMemo(() => sortedNodes.filter((name) => !hiddenNodes.has(name)), [hiddenNodes, sortedNodes]);

  const visibleEdges = useMemo(
    () => edges.filter((edge) => !hiddenNodes.has(edge.from) && !hiddenNodes.has(edge.to)),
    [edges, hiddenNodes]
  );

  // Hitung degree (jumlah koneksi) setiap node
  const nodeDegrees = useMemo(() => {
    const degrees = {};
    visibleNodes.forEach((node) => (degrees[node] = 0));
    visibleEdges.forEach((edge) => {
      degrees[edge.from] = (degrees[edge.from] || 0) + 1;
      if (edge.from !== edge.to) {
        degrees[edge.to] = (degrees[edge.to] || 0) + 1;
      }
    });
    return degrees;
  }, [visibleEdges, visibleNodes]);

  const nodeWidth = 120;
  const nodeHeight = 40;
  const padding = 100;
  const minNodeDistance = 180; // Jarak minimum antar node

  // Force-Directed Layout dengan spacing lebih besar
  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (!visibleNodes.length) {
      setPositionedNodes([]);
      setIsSimulating(false);
      return;
    }

    const width = svgDimensions.width;
    const height = svgDimensions.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize dengan circular layout yang lebih besar
    const initialNodes = visibleNodes.map((name, index) => {
      const angle = (index / visibleNodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      return {
        name,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
      };
    });

    setPositionedNodes(initialNodes);
    setIsSimulating(true);

    // Simulation parameters - diperkuat untuk spacing lebih besar
    const params = {
      repulsion: 15000, // Repulsion lebih kuat
      attraction: 0.008, // Attraction lebih lemah
      centerGravity: 0.015,
      damping: 0.88,
      maxIterations: 400,
      minVelocity: 0.08,
      minDistance: minNodeDistance, // Jarak minimum antar node
    };

    let iteration = 0;

    const simulate = () => {
      setPositionedNodes((prevNodes) => {
        if (iteration >= params.maxIterations) {
          setIsSimulating(false);
          return prevNodes;
        }

        const nextNodes = prevNodes.map((node) => ({ ...node }));
        const nodeMap = {};
        nextNodes.forEach((node) => (nodeMap[node.name] = node));

        // 1. Repulsion force dengan minimum distance
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const nodeA = nextNodes[i];
            const nodeB = nextNodes[j];
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

            // Repulsion lebih kuat jika terlalu dekat
            const distanceFactor = distance < params.minDistance ? 2.5 : 1;
            const force = (params.repulsion / (distance * distance)) * distanceFactor;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            nodeA.vx -= fx;
            nodeA.vy -= fy;
            nodeB.vx += fx;
            nodeB.vy += fy;
          }
        }

        // 2. Attraction force untuk edges
        visibleEdges.forEach((edge) => {
          const nodeA = nodeMap[edge.from];
          const nodeB = nodeMap[edge.to];
          if (!nodeA || !nodeB || nodeA === nodeB) return;

          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          // Hanya tarik jika jarak > minDistance
          if (distance > params.minDistance * 1.2) {
            const force = (distance - params.minDistance) * params.attraction;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;
            nodeA.vx += fx;
            nodeA.vy += fy;
            nodeB.vx -= fx;
            nodeB.vy -= fy;
          }
        });

        // 3. Center gravity
        nextNodes.forEach((node) => {
          const dx = centerX - node.x;
          const dy = centerY - node.y;
          node.vx += dx * params.centerGravity;
          node.vy += dy * params.centerGravity;
        });

        // 4. Update positions
        let maxVelocity = 0;
        nextNodes.forEach((node) => {
          node.vx *= params.damping;
          node.vy *= params.damping;
          node.x += node.vx;
          node.y += node.vy;

          // Boundary constraints
          node.x = Math.max(padding, Math.min(width - padding, node.x));
          node.y = Math.max(padding, Math.min(height - padding, node.y));

          const velocity = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
          maxVelocity = Math.max(maxVelocity, velocity);
        });

        iteration++;

        if (maxVelocity < params.minVelocity) {
          setIsSimulating(false);
        }

        return nextNodes;
      });

      if (iteration < params.maxIterations) {
        animationRef.current = requestAnimationFrame(simulate);
      }
    };

    animationRef.current = requestAnimationFrame(simulate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visibleNodes, visibleEdges, svgDimensions]);

  const getSvgCoordinates = (event) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: svgPoint.x, y: svgPoint.y };
  };

  const handleMouseDown = (event, nodeName) => {
    event.preventDefault();
    const currentNode = positionedNodes.find((n) => n.name === nodeName);
    if (!currentNode) return;

    const mousePos = getSvgCoordinates(event);
    setDraggedNodeName(nodeName);
    setDragOffset({
      x: mousePos.x - currentNode.x,
      y: mousePos.y - currentNode.y,
    });
  };

  const handleMouseMove = (event) => {
    if (!draggedNodeName) return;

    const mousePos = getSvgCoordinates(event);
    const newX = mousePos.x - dragOffset.x;
    const newY = mousePos.y - dragOffset.y;

    const clampedX = Math.max(nodeWidth / 2 + 10, Math.min(svgDimensions.width - nodeWidth / 2 - 10, newX));
    const clampedY = Math.max(nodeHeight / 2 + 10, Math.min(svgDimensions.height - nodeHeight / 2 - 10, newY));

    setPositionedNodes((prevNodes) => prevNodes.map((node) => (node.name === draggedNodeName ? { ...node, x: clampedX, y: clampedY, vx: 0, vy: 0 } : node)));
  };

  const handleMouseUp = () => {
    setDraggedNodeName(null);
  };

  const nodeMap = useMemo(
    () =>
      positionedNodes.reduce((map, node) => {
        map[node.name] = node;
        return map;
      }, {}),
    [positionedNodes]
  );

  // Kelompokkan edges per pasangan node
  const edgeGroups = useMemo(() => {
    const groups = new Map();
    visibleEdges.forEach((edge, index) => {
      if (edge.from === edge.to) {
        groups.set(`self-${index}`, [{ edge, index, isSelf: true }]);
        return;
      }
      const sortedPair = [edge.from, edge.to].sort();
      const key = `${sortedPair[0]}__${sortedPair[1]}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key).push({
        edge,
        index,
        isForward: edge.from === sortedPair[0],
        isSelf: false,
      });
    });
    return groups;
  }, [visibleEdges]);

  // Orthogonal edge routing - garis berbelok seperti gambar 2
  const getOrthogonalPath = (fromNode, toNode, slotIndex, totalSlots) => {
    const margin = 12;
    const startX = fromNode.x;
    const startY = fromNode.y;
    const endX = toNode.x;
    const endY = toNode.y;

    // Hitung offset untuk multiple edges
    const spacing = 15;
    const offset = totalSlots > 1 ? (slotIndex - (totalSlots - 1) / 2) * spacing : 0;

    // Tentukan arah keluar dari node
    const dx = endX - startX;
    const dy = endY - startY;

    // Titik keluar dari node source
    let outX, outY;
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal dominant
      outX = startX + (dx > 0 ? nodeWidth / 2 + margin : -nodeWidth / 2 - margin);
      outY = startY + offset;
    } else {
      // Vertical dominant
      outX = startX + offset;
      outY = startY + (dy > 0 ? nodeHeight / 2 + margin : -nodeHeight / 2 - margin);
    }

    // Titik masuk ke node target
    let inX, inY;
    if (Math.abs(dx) > Math.abs(dy)) {
      inX = endX + (dx > 0 ? -nodeWidth / 2 - margin : nodeWidth / 2 + margin);
      inY = endY - offset;
    } else {
      inX = endX - offset;
      inY = endY + (dy > 0 ? -nodeHeight / 2 - margin : nodeHeight / 2 + margin);
    }

    // Buat path orthogonal (berbelok tegak lurus)
    const midX = (outX + inX) / 2;
    const midY = (outY + inY) / 2;

    let pathString;
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal route: keluar horizontal, belok vertical, masuk horizontal
      pathString = `M ${outX},${outY} L ${midX},${outY} L ${midX},${inY} L ${inX},${inY}`;
    } else {
      // Vertical route: keluar vertical, belok horizontal, masuk vertical
      pathString = `M ${outX},${outY} L ${outX},${midY} L ${inX},${midY} L ${inX},${inY}`;
    }

    // Label position di tengah path
    const labelX = midX;
    const labelY = midY;

    return { pathString, labelX, labelY };
  };

  const toggleNodeVisibility = (name) => {
    setHiddenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const showAllNodes = () => {
    setHiddenNodes(new Set());
  };

  const hideAllNodes = () => {
    setHiddenNodes(new Set(sortedNodes));
  };

  const allNodesHidden = visibleNodes.length === 0;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Pola Transisi Signifikan (Orthogonal Routing)</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Panah menunjukkan alur urutan perilaku dengan nilai Z-score ≥ 1.96. Garis berbelok untuk menghindari tabrakan.</p>
        </div>
        {isSimulating && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span>Optimizing layout...</span>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/30">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Atur Visibilitas Node</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Toggle untuk menyembunyikan node beserta garis transisi yang terhubung.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={showAllNodes}
              disabled={hiddenNodes.size === 0}
              className="rounded-md border border-blue-500 px-3 py-1 text-xs font-medium text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-300 dark:text-blue-200 dark:hover:bg-blue-900/40"
            >
              Tampilkan Semua
            </button>
            <button
              type="button"
              onClick={hideAllNodes}
              disabled={sortedNodes.length === 0 || hiddenNodes.size === sortedNodes.length}
              className="rounded-md border border-slate-400 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700/40"
            >
              Sembunyikan Semua
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {sortedNodes.length === 0 && <span className="text-xs text-slate-500 dark:text-slate-400">Tidak ada node yang tersedia.</span>}
          {sortedNodes.map((name) => {
            const isHidden = hiddenNodes.has(name);
            const score = nodeScores[name];
            const hasScore = Number.isFinite(score);
            return (
              <label
                key={name}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                  isHidden
                    ? "border-slate-300 bg-white text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-400"
                    : "border-blue-200 bg-blue-50 text-blue-700 shadow-sm dark:border-blue-500/40 dark:bg-blue-900/30 dark:text-blue-200"
                }`}
              >
                <input type="checkbox" className="h-3 w-3 accent-blue-600 dark:accent-blue-400" checked={!isHidden} onChange={() => toggleNodeVisibility(name)} />
                <span>{name}</span>
                {hasScore && (
                  <span className="text-[10px] font-normal text-slate-400 dark:text-slate-300">
                    {score.toFixed(2)}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
      <div className="mt-6 flex justify-center overflow-auto">
        {allNodesHidden ? (
          <div className="flex min-h-[300px] w-full max-w-4xl items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-300">
            Semua node disembunyikan. Aktifkan kembali salah satu node untuk melihat diagram.
          </div>
        ) : (
          <svg
            ref={svgRef}
            width={svgDimensions.width}
            height={svgDimensions.height}
            viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/30"
          >
          <defs>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" className="dark:fill-blue-400" />
            </marker>
          </defs>

          {/* Gambar Edges dengan Orthogonal Routing */}
          <g>
            {Array.from(edgeGroups.entries()).map(([key, group]) => {
              return group.map((item, idx) => {
                const { edge, index, isSelf } = item;
                const fromNode = nodeMap[edge.from];
                const toNode = nodeMap[edge.to];
                if (!fromNode || !toNode) return null;

                // Self-loop
                if (isSelf) {
                  const loopRadius = 25;
                  const loopOffset = 5;

                  // Cek apakah node di bagian bawah canvas
                  const isBottomHalf = fromNode.y > svgDimensions.height / 2;

                  let startX, startY, endX, endY, textX, textY, pathData;

                  if (isBottomHalf) {
                    // Loop di bawah node
                    startX = fromNode.x;
                    startY = fromNode.y + nodeHeight / 2 + loopOffset;
                    endX = fromNode.x + nodeWidth / 4;
                    endY = fromNode.y + nodeHeight / 2 + loopOffset;
                    textX = fromNode.x + loopRadius;
                    textY = fromNode.y + nodeHeight / 2 + loopRadius + 18;
                    pathData = `M ${startX},${startY} A ${loopRadius},${loopRadius} 0 1,0 ${endX},${endY}`;
                  } else {
                    // Loop di atas node (default)
                    startX = fromNode.x;
                    startY = fromNode.y - nodeHeight / 2 - loopOffset;
                    endX = fromNode.x + nodeWidth / 4;
                    endY = fromNode.y - nodeHeight / 2 - loopOffset;
                    textX = fromNode.x + loopRadius;
                    textY = fromNode.y - nodeHeight / 2 - loopRadius - 8;
                    pathData = `M ${startX},${startY} A ${loopRadius},${loopRadius} 0 1,1 ${endX},${endY}`;
                  }

                  return (
                    <g key={`edge-${index}-self`}>
                      <path d={pathData} stroke="#3b82f6" className="dark:stroke-blue-400" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                      <rect x={textX - 18} y={textY - 10} width="36" height="20" rx="4" fill="white" stroke="#3b82f6" strokeWidth="1.5" className="dark:fill-slate-800 dark:stroke-blue-400" />
                      <text x={textX} y={textY + 4} textAnchor="middle" className="text-[10px] fill-blue-600 dark:fill-blue-400 font-bold">
                        {edge.z.toFixed(2)}
                      </text>
                    </g>
                  );
                }

                // Orthogonal routing untuk edges normal
                const totalSlots = group.filter((g) => !g.isSelf).length;
                const slotIndex = group.filter((g) => !g.isSelf).findIndex((g) => g.index === index);
                const { pathString, labelX, labelY } = getOrthogonalPath(fromNode, toNode, slotIndex, totalSlots);

                return (
                  <g key={`edge-${index}`}>
                    <path d={pathString} stroke="#3b82f6" className="dark:stroke-blue-400" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" strokeLinejoin="round" />
                    <rect x={labelX - 18} y={labelY - 10} width="36" height="20" rx="4" fill="white" stroke="#3b82f6" strokeWidth="1.5" className="dark:fill-slate-800 dark:stroke-blue-400" />
                    <text x={labelX} y={labelY + 4} textAnchor="middle" className="text-[10px] fill-blue-600 dark:fill-blue-400 font-bold">
                      {edge.z.toFixed(2)}
                    </text>
                  </g>
                );
              });
            })}
          </g>

          {/* Gambar Nodes */}
          <g>
            {positionedNodes.map((node) => {
              const degree = nodeDegrees[node.name] || 0;
              const isHub = degree > 4;
              return (
                <g key={node.name} transform={`translate(${node.x}, ${node.y})`} onMouseDown={(e) => handleMouseDown(e, node.name)} style={{ cursor: "grab" }} className={draggedNodeName === node.name ? "grabbing" : ""}>
                  <rect
                    x={-nodeWidth / 2}
                    y={-nodeHeight / 2}
                    width={nodeWidth}
                    height={nodeHeight}
                    rx={10}
                    ry={10}
                    fill={isHub ? "#dbeafe" : "#ffffff"}
                    stroke={isHub ? "#2563eb" : "#64748b"}
                    className="dark:fill-slate-800 dark:stroke-slate-500"
                    strokeWidth={isHub ? "2.5" : "2"}
                  />
                  {isHub && <circle cx={nodeWidth / 2 - 8} cy={-nodeHeight / 2 + 8} r="4" fill="#ef4444" className="dark:fill-red-500" />}
                  <text y={5} textAnchor="middle" className="text-[10px] font-bold fill-gray-800 dark:fill-slate-200 pointer-events-none">
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
          </svg>
        )}
        <style jsx>{`
          .grabbing,
          .grabbing * {
            cursor: grabbing !important;
          }
        `}</style>
      </div>
    </div>
  );
};

export default BehaviorChart;
