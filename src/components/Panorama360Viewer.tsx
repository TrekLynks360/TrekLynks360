import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PanoramaScene, Hotspot } from '../types';
import { createEquirectangularHimalayaTexture } from '../utils/panoramaTextures';
import { Compass, Eye, Mountain } from 'lucide-react';

interface Panorama360ViewerProps {
  scene: PanoramaScene;
  isAutoRotate: boolean;
  onHeadingChange: (headingDeg: number, pitchDeg: number) => void;
  onSelectHotspot: (hotspot: Hotspot | null) => void;
  activeHotspot: Hotspot | null;
  targetHeadingRef?: React.MutableRefObject<((heading: number, pitch?: number) => void) | null>;
}

export const Panorama360Viewer: React.FC<Panorama360ViewerProps> = ({
  scene,
  isAutoRotate,
  onHeadingChange,
  onSelectHotspot,
  activeHotspot,
  targetHeadingRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const [hasWebGLError, setHasWebGLError] = useState(false);

  // Rotation & Inertia State
  const lonRef = useRef(180); // 0-360 degrees
  const latRef = useRef(0); // -85 to +85 degrees
  const targetLonRef = useRef(180);
  const targetLatRef = useRef(0);
  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerX = useRef(0);
  const onPointerDownPointerY = useRef(0);
  const onPointerDownLon = useRef(0);
  const onPointerDownLat = useRef(0);

  // Stable refs for props inside animation loop
  const isAutoRotateRef = useRef(isAutoRotate);
  isAutoRotateRef.current = isAutoRotate;

  const onHeadingChangeRef = useRef(onHeadingChange);
  onHeadingChangeRef.current = onHeadingChange;

  const sceneHotspotsRef = useRef(scene.hotspots);
  sceneHotspotsRef.current = scene.hotspots;

  // Hotspots Screen Positions
  const [projectedHotspots, setProjectedHotspots] = useState<
    { hotspot: Hotspot; x: number; y: number; visible: boolean }[]
  >([]);

  // Update sphere texture when scene or skyTheme changes without re-creating WebGL
  useEffect(() => {
    if (!sphereMeshRef.current || hasWebGLError) return;
    try {
      const canvas = createEquirectangularHimalayaTexture(scene.id, scene.skyTheme);
      const newTexture = new THREE.CanvasTexture(canvas);
      newTexture.wrapS = THREE.RepeatWrapping;
      newTexture.repeat.x = -1;

      if (textureRef.current) {
        textureRef.current.dispose();
      }
      textureRef.current = newTexture;

      const material = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
      material.map = newTexture;
      material.needsUpdate = true;
    } catch (e) {
      console.warn('Failed to update 360 texture:', e);
    }
  }, [scene.id, scene.skyTheme, hasWebGLError]);

  // Expose smooth turn method to parent
  const smoothTurnTo = useCallback((headingDeg: number, pitchDeg = 0) => {
    targetLonRef.current = headingDeg;
    targetLatRef.current = pitchDeg;
  }, []);

  useEffect(() => {
    if (targetHeadingRef) {
      targetHeadingRef.current = smoothTurnTo;
    }
  }, [smoothTurnTo, targetHeadingRef]);

  // Initialize Three.js WebGL Scene ONCE on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability safely
    const checkWebGL = () => {
      try {
        const testCanvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      console.warn('WebGL not supported by environment, activating interactive 2D panorama canvas');
      setHasWebGLError(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    let threeScene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let geometry: THREE.SphereGeometry;
    let material: THREE.MeshBasicMaterial;
    let texture: THREE.CanvasTexture;
    let animationFrameId: number;

    try {
      // 1. Scene
      threeScene = new THREE.Scene();
      sceneRef.current = threeScene;

      // 2. Camera
      camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1200);
      cameraRef.current = camera;

      // 3. Renderer with safe parameters
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(width, height);
      rendererRef.current = renderer;

      // Handle WebGL context loss safely
      const handleContextLost = (event: Event) => {
        event.preventDefault(); // Prevents browser from marking page as context lost and blocked
        console.warn('WebGL context lost in Panorama360Viewer');
        setHasWebGLError(true);
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

      container.replaceChildren(renderer.domElement);

      // 4. Panorama Sphere
      geometry = new THREE.SphereGeometry(500, 48, 32);
      geometry.scale(-1, 1, 1);

      const canvas = createEquirectangularHimalayaTexture(scene.id, scene.skyTheme);
      texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;
      textureRef.current = texture;

      material = new THREE.MeshBasicMaterial({ map: texture });
      const sphere = new THREE.Mesh(geometry, material);
      threeScene.add(sphere);
      sphereMeshRef.current = sphere;

      // 5. Alpine Snow Particles
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 20 + Math.random() * 80;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i + 2] = radius * Math.cos(phi);
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.2,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      threeScene.add(particles);

      // 6. Animation Loop
      let lastHeadingReport = 0;

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        // Auto-rotation when not dragging
        if (isAutoRotateRef.current && !isUserInteractingRef.current) {
          targetLonRef.current = (targetLonRef.current + 0.08) % 360;
        }

        // Smooth camera dampening
        lonRef.current += (targetLonRef.current - lonRef.current) * 0.12;
        latRef.current += (targetLatRef.current - latRef.current) * 0.12;

        // Clamp lat
        latRef.current = Math.max(-80, Math.min(80, latRef.current));

        // Calculate camera target in spherical coords
        const phi = THREE.MathUtils.degToRad(90 - latRef.current);
        const theta = THREE.MathUtils.degToRad(lonRef.current);

        const targetX = 500 * Math.sin(phi) * Math.cos(theta);
        const targetY = 500 * Math.cos(phi);
        const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(targetX, targetY, targetZ);

        particles.rotation.y += 0.0004;

        renderer.render(threeScene, camera);

        // Report heading periodically
        const currentHeading = ((lonRef.current % 360) + 360) % 360;
        if (Math.abs(currentHeading - lastHeadingReport) > 0.5) {
          lastHeadingReport = currentHeading;
          if (onHeadingChangeRef.current) {
            onHeadingChangeRef.current(Math.round(currentHeading), Math.round(latRef.current));
          }
        }

        // Project 3D Hotspots into 2D Screen Space
        const curContainer = containerRef.current;
        const curWidth = curContainer ? curContainer.clientWidth : width;
        const curHeight = curContainer ? curContainer.clientHeight : height;
        const currentHotspots = sceneHotspotsRef.current;

        if (currentHotspots && currentHotspots.length > 0) {
          const halfWidth = curWidth / 2;
          const halfHeight = curHeight / 2;
          const projections = currentHotspots.map((spot) => {
            const hPhi = THREE.MathUtils.degToRad(90 - spot.phi);
            const hTheta = THREE.MathUtils.degToRad(spot.theta);
            const hPos = new THREE.Vector3(
              -420 * Math.sin(hPhi) * Math.cos(hTheta),
              420 * Math.cos(hPhi),
              -420 * Math.sin(hPhi) * Math.sin(hTheta)
            );

            const projected = hPos.clone().project(camera);
            const isBehind = projected.z > 1;
            const sx = projected.x * halfWidth + halfWidth;
            const sy = -(projected.y * halfHeight) + halfHeight;

            return {
              hotspot: spot,
              x: sx,
              y: sy,
              visible: !isBehind && sx > -50 && sx < curWidth + 50 && sy > -50 && sy < curHeight + 50,
            };
          });
          setProjectedHotspots(projections);
        }
      };

      animate();

      // Resize Handler
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        if (renderer.domElement) {
          renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
        }
        try {
          renderer.dispose();
          renderer.forceContextLoss();
          if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        } catch {
          // ignore
        }
        geometry.dispose();
        material.dispose();
        if (textureRef.current) {
          textureRef.current.dispose();
        }
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch (err) {
      console.warn('Three.js WebGL initialization caught error, switching to interactive 2D panorama canvas:', err);
      setHasWebGLError(true);
      return;
    }
  }, []);

  // 2D Canvas Fallback Render Loop (runs if WebGL is disabled or context lost)
  useEffect(() => {
    if (!hasWebGLError) return;

    let animId: number;
    const canvas = fallbackCanvasRef.current;
    if (!canvas) return;

    const equirectSource = createEquirectangularHimalayaTexture(scene.id, scene.skyTheme);
    let lastHeadingReport = 0;

    const render2D = () => {
      animId = requestAnimationFrame(render2D);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      if (isAutoRotateRef.current && !isUserInteractingRef.current) {
        targetLonRef.current = (targetLonRef.current + 0.08) % 360;
      }

      lonRef.current += (targetLonRef.current - lonRef.current) * 0.12;
      latRef.current += (targetLatRef.current - latRef.current) * 0.12;
      latRef.current = Math.max(-60, Math.min(60, latRef.current));

      const w = canvas.width;
      const h = canvas.height;

      // Clear
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, w, h);

      // Draw wrapped panoramic image
      const srcW = equirectSource.width;
      const srcH = equirectSource.height;
      const fovAngle = 80; // degrees visible horizontally
      const normLon = ((lonRef.current % 360) + 360) % 360;
      const srcX = (normLon / 360) * srcW;
      const viewSrcW = (fovAngle / 360) * srcW;
      const normLat = latRef.current;
      const srcY = Math.max(0, Math.min(srcH - (h / w) * viewSrcW, (srcH / 2) - ((normLat + 20) / 180) * srcH));
      const viewSrcH = Math.min(srcH, (h / w) * viewSrcW);

      // Draw primary slice
      ctx.drawImage(equirectSource, srcX, srcY, Math.min(viewSrcW, srcW - srcX), viewSrcH, 0, 0, w * ((Math.min(viewSrcW, srcW - srcX)) / viewSrcW), h);
      // Wrap around slice if view extends past edge
      if (srcX + viewSrcW > srcW) {
        const remainder = (srcX + viewSrcW) - srcW;
        const drawnWidth = w * ((srcW - srcX) / viewSrcW);
        ctx.drawImage(equirectSource, 0, srcY, remainder, viewSrcH, drawnWidth, 0, w - drawnWidth, h);
      }

      // Atmospheric Vignette in 2D
      const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.65);
      grad.addColorStop(0, 'rgba(2, 6, 23, 0)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.65)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Report heading
      if (Math.abs(normLon - lastHeadingReport) > 0.5) {
        lastHeadingReport = normLon;
        if (onHeadingChangeRef.current) {
          onHeadingChangeRef.current(Math.round(normLon), Math.round(normLat));
        }
      }

      // Calculate 2D Hotspot projections
      const currentHotspots = sceneHotspotsRef.current;
      if (currentHotspots && currentHotspots.length > 0) {
        const projections = currentHotspots.map((spot) => {
          let diffTheta = (spot.theta - normLon + 540) % 360 - 180;
          const sx = w / 2 + (diffTheta / (fovAngle / 2)) * (w / 2);
          const sy = h / 2 - ((spot.phi - normLat) / 45) * (h / 2);
          const visible = Math.abs(diffTheta) < fovAngle / 1.8 && sy > 50 && sy < h - 80;

          return {
            hotspot: spot,
            x: sx,
            y: sy,
            visible,
          };
        });
        setProjectedHotspots(projections);
      }
    };

    render2D();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [hasWebGLError, scene.id, scene.skyTheme]);

  // Pointer Drag Event Handlers
  const onPointerDown = (event: React.PointerEvent) => {
    isUserInteractingRef.current = true;
    onPointerDownPointerX.current = event.clientX;
    onPointerDownPointerY.current = event.clientY;
    onPointerDownLon.current = targetLonRef.current;
    onPointerDownLat.current = targetLatRef.current;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent) => {
    if (!isUserInteractingRef.current) return;
    const factor = 0.18; // rotation speed factor
    targetLonRef.current = (onPointerDownPointerX.current - event.clientX) * factor + onPointerDownLon.current;
    targetLatRef.current = (event.clientY - onPointerDownPointerY.current) * factor + onPointerDownLat.current;
  };

  const onPointerUp = (event: React.PointerEvent) => {
    isUserInteractingRef.current = false;
    try {
      (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel Zoom (Adjust Camera FOV)
  const onWheel = (event: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const newFov = cameraRef.current.fov + event.deltaY * 0.04;
    cameraRef.current.fov = Math.max(40, Math.min(85, newFov));
    cameraRef.current.updateProjectionMatrix();
  };

  return (
    <div
      id="panorama-360-container"
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing overflow-hidden bg-slate-950"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onWheel={onWheel}
    >
      {/* 3D WebGL Canvas mount container */}
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full pointer-events-auto ${hasWebGLError ? 'hidden' : 'block'}`}
      />

      {/* 2D Canvas Fallback when WebGL is unavailable or blocked */}
      {hasWebGLError && (
        <canvas
          ref={fallbackCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-auto block"
        />
      )}

      {/* Subtle Depth Vignette & Horizon Lighting Glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial-[circle_at_center,transparent_40%,rgba(2,6,23,0.55)_100%]" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

      {/* 3D Hotspots Layer Over Mountain Peaks */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {projectedHotspots.map(({ hotspot, x, y, visible }) => {
          if (!visible) return null;
          const isSelected = activeHotspot?.id === hotspot.id;

          return (
            <div
              key={hotspot.id}
              style={{
                transform: `translate3d(${x}px, ${y}px, 0)`,
                transformOrigin: 'bottom center',
              }}
              className="absolute pointer-events-auto group -translate-x-1/2 -translate-y-full transition-transform duration-100 ease-out"
            >
              {/* Hotspot Pin */}
              <button
                id={`hotspot-pin-${hotspot.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHotspot(isSelected ? null : hotspot);
                  smoothTurnTo(hotspot.theta, hotspot.phi);
                }}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full border backdrop-blur-md transition-all shadow-xl ${
                  isSelected
                    ? 'bg-red-600/90 border-yellow-400 text-white shadow-red-500/40 ring-2 ring-yellow-400 scale-110'
                    : 'bg-slate-900/80 hover:bg-slate-800/90 border-white/20 text-slate-100 hover:border-yellow-400/80 hover:scale-105'
                }`}
              >
                {/* Pulsing indicator dot */}
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSelected ? 'bg-yellow-300' : 'bg-red-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isSelected ? 'bg-yellow-400' : 'bg-red-500'
                    }`}
                  />
                </span>

                <Mountain className="w-3.5 h-3.5 text-yellow-400" />
                <span className="text-xs font-bold font-['Rajdhani',sans-serif] tracking-wider whitespace-nowrap">
                  {hotspot.title}
                </span>
                <span className="text-[10px] text-yellow-300/90 font-mono tracking-tight">
                  {hotspot.altitude.split(' ')[0]}
                </span>
              </button>

              {/* Hover / Active Detail Tooltip */}
              {(isSelected || false) && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3.5 rounded-xl bg-slate-900/95 border border-yellow-400/40 shadow-2xl backdrop-blur-xl text-left pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between text-[11px] font-bold text-yellow-400 font-['Rajdhani',sans-serif] tracking-widest uppercase">
                    <span>Himalayan Landmark</span>
                    <span className="text-emerald-400 font-mono">{hotspot.altitude}</span>
                  </div>
                  <h4 className="text-sm font-extrabold text-white mt-1">{hotspot.title}</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{hotspot.description}</p>
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Garhwal Coordinates</span>
                    <span className="text-yellow-400/90 font-mono font-semibold">
                      θ {hotspot.theta}° | φ {hotspot.phi}°
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
