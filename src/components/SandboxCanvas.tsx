import React, { useRef, useEffect, useState } from 'react';
import { Reality, RealityEntity } from '../types/multiverse.ts';
import { Maximize2, RotateCcw, Grid, Eye, Zap, ShieldAlert } from 'lucide-react';

interface SandboxCanvasProps {
  reality: Reality | undefined;
  onSelectEntity?: (entity: RealityEntity) => void;
  selectedEntity?: RealityEntity | null;
}

export const SandboxCanvas: React.FC<SandboxCanvasProps> = ({
  reality,
  onSelectEntity,
  selectedEntity
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [showLinks, setShowLinks] = useState(true);
  const [hoveredEntity, setHoveredEntity] = useState<RealityEntity | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const isDormant = reality?.status === 'DORMANT';
  const isVoid = reality?.id === 'R_0' || !reality;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      // Resize to container size
      const width = canvas.parentElement?.clientWidth || 800;
      const height = canvas.parentElement?.clientHeight || 500;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Deep obsidian void background
      ctx.fillStyle = '#05070c';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2 + pan.x;
      const cy = height / 2 + pan.y;

      // 1. Grid lines (Relational Coordinate Mesh)
      if (showGrid) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1;
        const gridSize = 40 * zoom;

        const startX = cx % gridSize;
        const startY = cy % gridSize;

        ctx.beginPath();
        for (let x = startX; x < width; x += gridSize) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
        }
        for (let y = startY; y < height; y += gridSize) {
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Subtle coordinate axes (0,0)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
        ctx.stroke();

        // Origin crosshair mark
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 3 * zoom, 0, Math.PI * 2);
        ctx.stroke();
      }

      // If R_0 Primordial Void
      if (isVoid) {
        // Render single infinitesimal point at origin
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();

        // Faint vacuum wave
        const waveR = (Math.sin(t * 0.02) + 1) * 30 + 10;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
        ctx.stroke();

        // Primordial text
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'center';
        ctx.fillText('R_0 :: PRIMORDIAL NULL / ZERO EXTENT', cx, cy + 45);
        ctx.font = '11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#334155';
        ctx.fillText('No matter, dimensions, or time exist. Awaiting decree.', cx, cy + 64);

        if (!isDormant) t++;
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const entities = reality.entities || [];

      // Expansion ring
      const expansionRadius = Math.max(80, (reality.expansionRatio || 1.0) * 90 * zoom);
      ctx.strokeStyle = isDormant ? 'rgba(217, 119, 6, 0.2)' : 'rgba(34, 211, 238, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(cx, cy, expansionRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Relational Links between entities
      if (showLinks && entities.length > 1) {
        ctx.strokeStyle = isDormant ? 'rgba(148, 163, 184, 0.12)' : 'rgba(56, 189, 248, 0.18)';
        ctx.lineWidth = 1;

        for (let i = 0; i < entities.length; i++) {
          for (let j = i + 1; j < entities.length; j++) {
            const e1 = entities[i];
            const e2 = entities[j];
            const x1 = cx + (Number(e1.coordinates.x) || 0) * 70 * zoom;
            const y1 = cy + (Number(e1.coordinates.y) || 0) * 70 * zoom;
            const x2 = cx + (Number(e2.coordinates.x) || 0) * 70 * zoom;
            const y2 = cy + (Number(e2.coordinates.y) || 0) * 70 * zoom;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        }
      }

      // Draw Anomaly horizons if any
      if (reality.anomalies && reality.anomalies.length > 0) {
        reality.anomalies.forEach((anom, i) => {
          const anomX = cx + (i === 0 ? 120 : -140) * zoom;
          const anomY = cy + (i === 0 ? -90 : 110) * zoom;
          
          ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(anomX, anomY, 18 * zoom, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = 'rgba(244, 63, 94, 0.1)';
          ctx.beginPath();
          ctx.arc(anomX, anomY, 12 * zoom, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f43f5e';
          ctx.textAlign = 'center';
          ctx.fillText(`! ${anom.title}`, anomX, anomY + 28 * zoom);
        });
      }

      // Draw Entities
      entities.forEach((entity, index) => {
        const rawX = Number(entity.coordinates.x) || 0;
        const rawY = Number(entity.coordinates.y) || 0;

        // If active, apply subtle orbital drift
        const drift = !isDormant ? Math.sin(t * 0.03 + index) * 2 : 0;
        const ex = cx + rawX * 70 * zoom + drift;
        const ey = cy + rawY * 70 * zoom + drift;

        const isSelected = selectedEntity?.id === entity.id;
        const isHovered = hoveredEntity?.id === entity.id;
        const radius = Math.max(5, (entity.density || 1.0) * 5 * zoom);

        // Halo / selection glow
        if (isSelected || isHovered) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(ex, ey, radius + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Body fill
        if (entity.status === 'PROPAGATING') {
          ctx.fillStyle = isDormant ? '#d97706' : '#22d3ee';
        } else if (entity.status === 'PARADOXICAL') {
          ctx.fillStyle = '#ec4899';
        } else {
          ctx.fillStyle = isDormant ? '#94a3b8' : '#38bdf8';
        }

        ctx.beginPath();
        ctx.arc(ex, ey, radius, 0, Math.PI * 2);
        ctx.fill();

        // Entity label
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = isSelected ? '#f8fafc' : '#94a3b8';
        ctx.textAlign = 'left';
        ctx.fillText(entity.name, ex + radius + 6, ey + 4);

        // Subtitle / substrate
        ctx.font = '9px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(entity.substrate, ex + radius + 6, ey + 15);
      });

      if (!isDormant) t++;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [reality, zoom, pan, showGrid, showLinks, selectedEntity, hoveredEntity, isDormant, isVoid]);

  // Handle Canvas Clicking for Entity Selection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !reality) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2 + pan.x;
    const cy = height / 2 + pan.y;

    let clicked: RealityEntity | null = null;
    (reality.entities || []).forEach(entity => {
      const ex = cx + (Number(entity.coordinates.x) || 0) * 70 * zoom;
      const ey = cy + (Number(entity.coordinates.y) || 0) * 70 * zoom;
      const dist = Math.hypot(mx - ex, my - ey);
      if (dist < 20 * zoom) {
        clicked = entity;
      }
    });

    if (clicked && onSelectEntity) {
      onSelectEntity(clicked);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setMousePos({ x: mx, y: my });

    if (!reality) return;
    const cx = canvas.width / 2 + pan.x;
    const cy = canvas.height / 2 + pan.y;

    let found: RealityEntity | null = null;
    (reality.entities || []).forEach(entity => {
      const ex = cx + (Number(entity.coordinates.x) || 0) * 70 * zoom;
      const ey = cy + (Number(entity.coordinates.y) || 0) * 70 * zoom;
      const dist = Math.hypot(mx - ex, my - ey);
      if (dist < 20 * zoom) {
        found = entity;
      }
    });
    setHoveredEntity(found);
  };

  return (
    <div className="relative w-full h-full min-h-[460px] bg-[#05070c] border border-slate-800 rounded-lg overflow-hidden flex flex-col">
      {/* Top HUD bar on canvas */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="bg-[#0b101d]/80 backdrop-blur border border-slate-800 rounded px-3 py-1.5 flex items-center gap-3 text-xs font-mono pointer-events-auto">
          <span className="text-slate-400 font-semibold">{reality?.id || 'R_0'}</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-200">{reality?.name || 'Void'}</span>
          <span className="text-slate-600">·</span>
          <span className={isDormant ? 'text-amber-400 font-medium' : isVoid ? 'text-slate-500' : 'text-cyan-400 font-medium'}>
            [{reality?.status || 'IDLE'}]
          </span>
          {isDormant && (
            <span className="text-[10px] text-amber-500/90 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
              Frozen at Step {reality?.stepCount || 0}
            </span>
          )}
        </div>

        {/* Viewport Tools */}
        <div className="bg-[#0b101d]/80 backdrop-blur border border-slate-800 rounded px-2 py-1 flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Relational Coordinate Grid"
            className={`p-1.5 rounded text-xs transition-colors ${showGrid ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowLinks(!showLinks)}
            title="Toggle Equivalence & Inference Links"
            className={`p-1.5 rounded text-xs transition-colors ${showLinks ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            title="Reset Origin (0,0)"
            className="p-1.5 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 2.5))}
            title="Zoom In"
            className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white"
          >
            +
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.4))}
            title="Zoom Out"
            className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-white"
          >
            -
          </button>
        </div>
      </div>

      {/* Main Canvas element */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="w-full h-full cursor-crosshair flex-1"
      />

      {/* Bottom Floating Telemetry Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-400 pointer-events-none">
        <div className="bg-[#0b101d]/80 backdrop-blur border border-slate-800 rounded px-2.5 py-1 pointer-events-auto flex items-center gap-3">
          <span>DIMENSIONS: {reality?.dimensionality || '0D'}</span>
          <span className="text-slate-700">|</span>
          <span>UNITS: NULL / DIMENSIONLESS</span>
          <span className="text-slate-700">|</span>
          <span className="text-cyan-400">EXPANSION RATIO: {reality?.expansionRatio?.toFixed(2) || '0.00'}×</span>
        </div>

        {hoveredEntity && (
          <div className="bg-[#0b101d]/90 backdrop-blur border border-cyan-500/40 text-slate-200 rounded px-3 py-1 pointer-events-auto flex items-center gap-2">
            <span className="text-cyan-400 font-semibold">{hoveredEntity.name}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{hoveredEntity.substrate}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Density: {hoveredEntity.density}</span>
          </div>
        )}
      </div>
    </div>
  );
};
