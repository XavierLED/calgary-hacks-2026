"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface NodeDef {
    id: number;
    x: number;
    y: number;
    hoverColor: string;
    r: number;
}

interface Edge {
    from: number;
    to: number;
    visible: boolean;
}

const COLORS = {
    blue: "#518BE1",
    red: "#E1516B",
    orange: "#E17751",
    grey: "#D6D6DB",
    fill: "#BED4F4",
    defaultNode: "#518BE1",
    defaultEdge: "#BED4F4",
};

// hoverColor is revealed on hover; everything starts blue
const NODES: NodeDef[] = [
    { id: 0, x: 120, y: 60, hoverColor: COLORS.grey, r: 10 },
    { id: 1, x: 280, y: 40, hoverColor: COLORS.blue, r: 14 },
    { id: 2, x: 200, y: 140, hoverColor: COLORS.orange, r: 11 },
    { id: 3, x: 420, y: 90, hoverColor: COLORS.grey, r: 9 },
    { id: 4, x: 360, y: 180, hoverColor: COLORS.blue, r: 13 },
    { id: 5, x: 520, y: 160, hoverColor: COLORS.red, r: 12 },
    { id: 6, x: 140, y: 250, hoverColor: COLORS.blue, r: 10 },
    { id: 7, x: 300, y: 280, hoverColor: COLORS.grey, r: 15 },
    { id: 8, x: 460, y: 260, hoverColor: COLORS.orange, r: 11 },
    { id: 9, x: 600, y: 280, hoverColor: COLORS.blue, r: 10 },
    { id: 10, x: 80, y: 370, hoverColor: COLORS.grey, r: 9 },
    { id: 11, x: 240, y: 380, hoverColor: COLORS.red, r: 13 },
    { id: 12, x: 400, y: 360, hoverColor: COLORS.blue, r: 12 },
    { id: 13, x: 540, y: 390, hoverColor: COLORS.grey, r: 10 },
    { id: 14, x: 660, y: 350, hoverColor: COLORS.orange, r: 11 },
    { id: 15, x: 180, y: 470, hoverColor: COLORS.blue, r: 10 },
    { id: 16, x: 340, y: 460, hoverColor: COLORS.grey, r: 14 },
    { id: 17, x: 500, y: 480, hoverColor: COLORS.red, r: 11 },
    { id: 18, x: 620, y: 460, hoverColor: COLORS.blue, r: 9 },
    { id: 19, x: 260, y: 550, hoverColor: COLORS.orange, r: 12 },
    { id: 20, x: 440, y: 560, hoverColor: COLORS.grey, r: 10 },
];

const EDGE_PAIRS: [number, number][] = [
    [0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [2, 6],
    [3, 4], [3, 5], [4, 5], [4, 7], [4, 8],
    [5, 8], [5, 9], [6, 7], [6, 10], [6, 11],
    [7, 8], [7, 11], [7, 12], [8, 9], [8, 12], [8, 13],
    [9, 13], [9, 14], [10, 11], [10, 15],
    [11, 12], [11, 15], [11, 16], [12, 13], [12, 16], [12, 17],
    [13, 14], [13, 17], [13, 18], [14, 18],
    [15, 16], [15, 19], [16, 17], [16, 19], [16, 20],
    [17, 18], [17, 20], [19, 20],
];

export default function AnimatedNodeGraph() {
    const [edges, setEdges] = useState<Edge[]>([]);
    const [hoveredNode, setHoveredNode] = useState<number | null>(null);

    useEffect(() => {
        setEdges(
            EDGE_PAIRS.map(([from, to]) => ({
                from,
                to,
                visible: Math.random() > 0.25,
            }))
        );

        const interval = setInterval(() => {
            setEdges((prev) =>
                prev.map((e) => ({
                    ...e,
                    visible: Math.random() > 0.3,
                }))
            );
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const isConnected = (nodeId: number) =>
        hoveredNode !== null &&
        EDGE_PAIRS.some(
            ([a, b]) =>
                (a === hoveredNode && b === nodeId) ||
                (b === hoveredNode && a === nodeId)
        );

    const getNodeColor = (node: NodeDef) => {
        if (hoveredNode === node.id) return node.hoverColor;
        if (isConnected(node.id)) return node.hoverColor;
        return COLORS.defaultNode;
    };

    return (
        <svg
            className="block h-full w-full"
            viewBox="0 0 740 600"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
        >
            {/* Edges */}
            {edges.map((edge, i) => {
                const a = NODES[edge.from];
                const b = NODES[edge.to];
                const isHoveredEdge =
                    hoveredNode === edge.from || hoveredNode === edge.to;
                const edgeColor = isHoveredEdge
                    ? NODES[hoveredNode!].hoverColor
                    : COLORS.defaultEdge;

                return (
                    <motion.line
                        key={`e-${i}`}
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={edgeColor}
                        strokeWidth={isHoveredEdge ? 2 : 1.2}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: isHoveredEdge
                                ? 0.8
                                : edge.visible
                                    ? 0.4
                                    : 0,
                        }}
                        transition={{ duration: isHoveredEdge ? 0.3 : 1.5, ease: "easeInOut" }}
                    />
                );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
                const color = getNodeColor(node);
                const isHovered = hoveredNode === node.id;
                const isNeighbor = isConnected(node.id);
                const active = isHovered || isNeighbor;

                return (
                    <g
                        key={node.id}
                        onMouseEnter={() => setHoveredNode(node.id)}
                        onMouseLeave={() => setHoveredNode(null)}
                        style={{ cursor: "pointer" }}
                    >
                        {/* Outer glow ring on hover */}
                        {active && (
                            <motion.circle
                                cx={node.x}
                                cy={node.y}
                                r={node.r + 6}
                                fill="none"
                                stroke={color}
                                strokeWidth={0.8}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.4, scale: 1.15 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}

                        {/* Main circle */}
                        <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r}
                            fill={color}
                            stroke={color}
                            strokeWidth={1.2}
                            fillOpacity={active ? 0.4 : 0.25}
                            animate={{
                                scale: isHovered ? 1.3 : [1, 1.08, 1],
                            }}
                            transition={{
                                scale: {
                                    duration: isHovered ? 0.25 : 2.5,
                                    repeat: isHovered ? 0 : Infinity,
                                    ease: "easeInOut",
                                    delay: isHovered ? 0 : node.id * 0.12,
                                },
                            }}
                        />

                        {/* Inner dot */}
                        <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r * 0.4}
                            fill={color}
                            animate={{
                                opacity: active ? [0.8, 1, 0.8] : [0.6, 1, 0.6],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: node.id * 0.1,
                            }}
                        />

                        {/* Invisible larger hit area */}
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r={node.r + 12}
                            fill="transparent"
                        />
                    </g>
                );
            })}
        </svg>
    );
}
