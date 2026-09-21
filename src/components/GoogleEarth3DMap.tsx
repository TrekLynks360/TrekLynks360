import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Mountain,
  MapPin,
  Eye,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { TREKS_DATA } from '../data/treksData';
import { Trek } from '../types';

interface GoogleEarth3DMapProps {
  onSelectTrekForBooking?: (trek: Trek) => void;
  onSwitchToPanorama?: () => void;
}

interface Waypoint {
  name: string;
  altitude: string;
  x: number;
  z: number;
  y: number;
  trekId: string;
  type: 'summit' | 'camp' | 'base' | 'pass';
}

const WAYPOINTS: Waypoint[] = [
  { name: 'Kedarkantha Peak', altitude: '12,500 ft', x: -35, z: -15, y: 14, trekId: 'kedarkantha', type: 'summit' },
  { name: 'Juda Ka Talab Lake', altitude: '9,100 ft', x: -45, z: -5, y: 8, trekId: 'kedarkantha', type: 'camp' },
  { name: 'Sankri Basecamp', altitude: '6,400 ft', x: -60, z: 10, y: 4, trekId: 'kedarkantha', type: 'base' },
  { name: 'Rupin Pass Summit', altitude: '15,250 ft', x: -10, z: -45, y: 19, trekId: 'rupin-pass', type: 'pass' },
  { name: 'Rupin Upper Waterfall', altitude: '13,120 ft', x: -15, z: -30, y: 13, trekId: 'rupin-pass', type: 'camp' },
  { name: 'Valley of Flowers Basin', altitude: '14,400 ft', x: 45, z: -20, y: 12, trekId: 'valley-of-flowers', type: 'summit' },
  { name: 'Ghangaria Basecamp', altitude: '9,800 ft', x: 35, z: -5, y: 7, trekId: 'valley-of-flowers', type: 'base' },
  { name: 'Har Ki Dun Valley', altitude: '11,700 ft', x: -25, z: 25, y: 11, trekId: 'har-ki-dun', type: 'camp' },
  { name: 'Osla Ancient Village', altitude: '8,500 ft', x: -35, z: 20, y: 6, trekId: 'har-ki-dun', type: 'base' },
  { name: 'Swargarohini Col', altitude: '20,512 ft', x: -5, z: 45, y: 24, trekId: 'har-ki-dun', type: 'summit' },
];

export const GoogleEarth3DMap: React.FC<GoogleEarth3DMapProps> = ({
  onSelectTrekForBooking,
  onSwitchToPanorama,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTrekId, setActiveTrekId] = useState<string>('kedarkantha');
  const [cameraAltitude, setCameraAltitude] = useState<number>(14250);
  const [pitchAngle, setPitchAngle] = useState<number>(45);
  const [headingBearing, setHeadingBearing] = useState<number>(340);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(WAYPOINTS[0]);
  const [mapLayer, setMapLayer] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  const [hasWebGLError, setHasWebGLError] = useState<boolean>(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  const controlsStateRef = useRef({
    radius: 95,
    theta: (340 * Math.PI) / 180,
    phi: (45 * Math.PI) / 180,
    target: new THREE.Vector3(0, 5, 0),
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
  });

  const activeTrek = TREKS_DATA.find((t) => t.id === activeTrekId) || TREKS_DATA[0];

  // Helper to fly to a location
  const flyToLocation = useCallback((targetX: number, targetY: number, targetZ: number, zoomDist = 70) => {
    const startTarget = controlsStateRef.current.target.clone();
    const endTarget = new THREE.Vector3(targetX, targetY, targetZ);
    const startRadius = controlsStateRef.current.radius;
    const endRadius = zoomDist;

    let progress = 0;
    const animateFly = () => {
      progress += 0.035;
      if (progress < 1) {
        controlsStateRef.current.target.lerpVectors(startTarget, endTarget, progress);
        controlsStateRef.current.radius = THREE.MathUtils.lerp(startRadius, endRadius, progress);
        requestAnimationFrame(animateFly);
      } else {
        controlsStateRef.current.target.copy(endTarget);
        controlsStateRef.current.radius = endRadius;
      }
    };
    animateFly();
  }, []);

  // Update trail colors when activeTrekId changes without destroying WebGL context
  useEffect(() => {
    if (!sceneRef.current) return;
    ['kedarkantha', 'rupin-pass', 'valley-of-flowers', 'har-ki-dun'].forEach((id) => {
      const mesh = sceneRef.current?.getObjectByName(`trail-${id}`) as THREE.Mesh;
      if (mesh && mesh.material) {
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.color.setHex(id === activeTrekId ? 0xfacc15 : 0xef4444);
        mat.opacity = id === activeTrekId ? 0.95 : 0.5;
      }
    });
  }, [activeTrekId]);

  // Initialize WebGL Scene ONCE on mount
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
      console.warn('WebGL not supported for GoogleEarth3DMap, activating 2D Topographic Satellite view');
      setHasWebGLError(true);
      return;
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let geometry: THREE.PlaneGeometry;
    let terrainMaterial: THREE.MeshStandardMaterial;
    let satelliteTexture: THREE.CanvasTexture;
    let animationFrameId: number;

    try {
      // 1. Scene
      scene = new THREE.Scene();
      sceneRef.current = scene;
      scene.background = new THREE.Color(0x030712);
      scene.fog = new THREE.FogExp2(0x051329, 0.0035);

      // 2. Camera
      camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
      cameraRef.current = camera;

      // 3. Renderer with safe parameters
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      rendererRef.current = renderer;

      const handleContextLost = (e: Event) => {
        e.preventDefault();
        console.warn('WebGL context lost in GoogleEarth3DMap');
        setHasWebGLError(true);
      };
      renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);

      container.replaceChildren(renderer.domElement);

      // 4. Lighting (Himalayan Sun & Atmospheric Scattering)
      const sunLight = new THREE.DirectionalLight(0xfff3d6, 2.4);
      sunLight.position.set(100, 120, 80);
      sunLight.castShadow = false;
      scene.add(sunLight);

      const hemiLight = new THREE.HemisphereLight(0x78a5e8, 0x1f2e1a, 1.2);
      scene.add(hemiLight);

      const ambientLight = new THREE.AmbientLight(0x334155, 0.6);
      scene.add(ambientLight);

      // 5. Generate 3D Himalayan Terrain Mesh with procedural Satellite Texture
      const terrainSize = 240;
      const segments = 96;
      geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
      geometry.rotateX(-Math.PI / 2);

      const pos = geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);

        const d1 = Math.sin(x * 0.04) * Math.cos(z * 0.04) * 14;
        const d2 = Math.sin(x * 0.08 + 1.2) * Math.sin(z * 0.07 + 0.8) * 8;
        const d3 = Math.cos(x * 0.15) * Math.sin(z * 0.12) * 3.5;
        
        const distKedarkantha = Math.hypot(x - (-35), z - (-15));
        const peakKedarkantha = Math.max(0, 18 - distKedarkantha * 0.7);

        const distRupin = Math.hypot(x - (-10), z - (-45));
        const peakRupin = Math.max(0, 24 - distRupin * 0.8);

        const distSwarga = Math.hypot(x - (-5), z - 45);
        const peakSwarga = Math.max(0, 28 - distSwarga * 0.85);

        const distVOF = Math.hypot(x - 45, z - (-20));
        const valleyVOF = Math.max(0, 14 - distVOF * 0.6);

        const elevation = Math.max(1, d1 + d2 + d3 + peakKedarkantha + peakRupin + peakSwarga + valleyVOF);
        pos.setY(i, elevation);
      }
      geometry.computeVertexNormals();

      // Procedural Satellite Texture
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#1c281e');
      grad.addColorStop(0.3, '#314227');
      grad.addColorStop(0.6, '#474744');
      grad.addColorStop(0.85, '#9fa8a3');
      grad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 300; i++) {
        const rx = Math.random() * 512;
        const ry = Math.random() * 512;
        const r = Math.random() * 60 + 10;
        ctx.beginPath();
        ctx.arc(rx, ry, r, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 35, 18, 0.15)';
        ctx.fill();
      }

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 450);
      ctx.bezierCurveTo(150, 350, 200, 250, 350, 100);
      ctx.stroke();

      satelliteTexture = new THREE.CanvasTexture(canvas);
      satelliteTexture.wrapS = THREE.RepeatWrapping;
      satelliteTexture.wrapT = THREE.RepeatWrapping;

      terrainMaterial = new THREE.MeshStandardMaterial({
        map: satelliteTexture,
        roughness: 0.85,
        metalness: 0.1,
        flatShading: true,
      });

      const terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
      scene.add(terrainMesh);

      // 6. 3D GPS Trek Paths
      const trailCurves: { [id: string]: THREE.Vector3[] } = {
        kedarkantha: [
          new THREE.Vector3(-60, 4.5, 10),
          new THREE.Vector3(-52, 6.2, 5),
          new THREE.Vector3(-45, 8.5, -5),
          new THREE.Vector3(-40, 11, -10),
          new THREE.Vector3(-35, 14.5, -15),
        ],
        'rupin-pass': [
          new THREE.Vector3(-30, 5, -10),
          new THREE.Vector3(-22, 9, -20),
          new THREE.Vector3(-15, 13.5, -30),
          new THREE.Vector3(-12, 16, -38),
          new THREE.Vector3(-10, 19.5, -45),
        ],
        'valley-of-flowers': [
          new THREE.Vector3(25, 4, 10),
          new THREE.Vector3(35, 7.5, -5),
          new THREE.Vector3(40, 10, -12),
          new THREE.Vector3(45, 12.5, -20),
          new THREE.Vector3(50, 14, -28),
        ],
        'har-ki-dun': [
          new THREE.Vector3(-48, 4, 15),
          new THREE.Vector3(-35, 6.5, 20),
          new THREE.Vector3(-25, 11.5, 25),
          new THREE.Vector3(-15, 16, 35),
          new THREE.Vector3(-5, 24.5, 45),
        ],
      };

      Object.entries(trailCurves).forEach(([id, points]) => {
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.45, 6, false);
        const tubeMaterial = new THREE.MeshBasicMaterial({
          color: id === activeTrekId ? 0xfacc15 : 0xef4444,
          transparent: true,
          opacity: id === activeTrekId ? 0.95 : 0.5,
        });
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);
        tubeMesh.name = `trail-${id}`;
        scene.add(tubeMesh);
      });

      // 7. 3D Waypoint Flag Pins
      const pinGroup = new THREE.Group();
      scene.add(pinGroup);

      WAYPOINTS.forEach((wp) => {
        const pinAnchor = new THREE.Group();
        pinAnchor.position.set(wp.x, wp.y + 0.2, wp.z);

        const stemGeo = new THREE.CylinderGeometry(0.12, 0.12, 4, 6);
        const stemMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 2;
        pinAnchor.add(stem);

        const headGeo = new THREE.SphereGeometry(1.1, 12, 12);
        const headMat = new THREE.MeshStandardMaterial({
          color: wp.type === 'summit' ? 0xfacc15 : wp.type === 'pass' ? 0xef4444 : 0x10b981,
          emissive: wp.type === 'summit' ? 0x854d0e : 0x7f1d1d,
          emissiveIntensity: 0.5,
        });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 4;
        pinAnchor.add(head);

        pinGroup.add(pinAnchor);
      });

      // 8. Distant Himalayan Stars
      const starsGeo = new THREE.BufferGeometry();
      const starCount = 800;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 800;
        starPos[i + 1] = Math.random() * 300 + 40;
        starPos[i + 2] = (Math.random() - 0.5) * 800;
      }
      starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, transparent: true, opacity: 0.7 });
      const starField = new THREE.Points(starsGeo, starsMat);
      scene.add(starField);

      // 9. Interactive Drag & Orbit Handling
      const state = controlsStateRef.current;

      const handlePointerDown = (e: MouseEvent | TouchEvent) => {
        state.isDragging = true;
        setIsRotating(false);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        state.prevMouseX = clientX;
        state.prevMouseY = clientY;
      };

      const handlePointerMove = (e: MouseEvent | TouchEvent) => {
        if (!state.isDragging) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - state.prevMouseX;
        const deltaY = clientY - state.prevMouseY;
        state.prevMouseX = clientX;
        state.prevMouseY = clientY;

        state.theta -= deltaX * 0.006;
        state.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, state.phi - deltaY * 0.005));

        const degBearing = Math.round(((state.theta * 180) / Math.PI) % 360);
        setHeadingBearing(degBearing < 0 ? degBearing + 360 : degBearing);
        setPitchAngle(Math.round((state.phi * 180) / Math.PI));
      };

      const handlePointerUp = () => {
        state.isDragging = false;
      };

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        state.radius = Math.max(30, Math.min(180, state.radius + e.deltaY * 0.06));
        setCameraAltitude(Math.round(state.radius * 160 + 6000));
      };

      container.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      container.addEventListener('touchstart', handlePointerDown, { passive: true });
      window.addEventListener('touchmove', handlePointerMove, { passive: true });
      window.addEventListener('touchend', handlePointerUp);
      container.addEventListener('wheel', handleWheel, { passive: false });

      // 10. Render Loop
      const render = () => {
        if (isRotatingRef.current && !state.isDragging) {
          state.theta += 0.0012;
          const degBearing = Math.round(((state.theta * 180) / Math.PI) % 360);
          setHeadingBearing(degBearing < 0 ? degBearing + 360 : degBearing);
        }

        const camX = state.target.x + state.radius * Math.sin(state.phi) * Math.sin(state.theta);
        const camY = state.target.y + state.radius * Math.cos(state.phi);
        const camZ = state.target.z + state.radius * Math.sin(state.phi) * Math.cos(state.theta);

        camera.position.set(camX, camY, camZ);
        camera.lookAt(state.target);

        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(render);
      };
      render();

      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        cancelAnimationFrame(animationFrameId);
        container.removeEventListener('mousedown', handlePointerDown);
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        container.removeEventListener('touchstart', handlePointerDown);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
        container.removeEventListener('wheel', handleWheel);
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
        terrainMaterial.dispose();
        satelliteTexture.dispose();
        starsGeo.dispose();
        starsMat.dispose();
      };
    } catch (err) {
      console.warn('Three.js WebGL initialization caught error in GoogleEarth3DMap, activating 2D Topographic view:', err);
      setHasWebGLError(true);
      return;
    }
  }, []);

  // Handle trek selector
  const handleSelectTrek = (trek: Trek) => {
    setActiveTrekId(trek.id);
    const targetWp = WAYPOINTS.find((wp) => wp.trekId === trek.id && wp.type === 'summit') || WAYPOINTS[0];
    setSelectedWaypoint(targetWp);
    flyToLocation(targetWp.x, targetWp.y, targetWp.z, 55);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const delta = direction === 'in' ? -15 : 15;
    controlsStateRef.current.radius = Math.max(30, Math.min(180, controlsStateRef.current.radius + delta));
    setCameraAltitude(Math.round(controlsStateRef.current.radius * 160 + 6000));
  };

  const handleResetOrientation = () => {
    controlsStateRef.current.theta = 0;
    controlsStateRef.current.phi = Math.PI / 4;
    controlsStateRef.current.radius = 95;
    controlsStateRef.current.target.set(0, 5, 0);
    setPitchAngle(45);
    setHeadingBearing(0);
    setCameraAltitude(21200);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-950 font-sans">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className={`absolute inset-0 cursor-grab active:cursor-grabbing z-0 ${hasWebGLError ? 'hidden' : 'block'}`}
      />

      {/* 2D Interactive Topographic & Satellite Map Fallback when WebGL is blocked or unavailable */}
      {hasWebGLError && (
        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden flex items-center justify-center pointer-events-auto">
          {/* Topographic Background with Relief & Contours */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

          {/* Interactive Topographic Map SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="snow-peak" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Background Grid */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Himalayan Mountain Ridge Contours */}
            <path d="M 50 650 Q 200 450 350 480 T 600 350 T 850 420 T 1000 300 L 1000 700 L 0 700 Z" fill="rgba(30, 41, 59, 0.4)" />
            <path d="M 0 520 Q 180 320 320 360 T 580 220 T 820 280 T 1000 180 L 1000 700 L 0 700 Z" fill="rgba(15, 23, 42, 0.6)" />

            {/* Major Peaks Relief */}
            <polygon points="780,140 860,260 700,260" fill="url(#snow-peak)" />
            <polygon points="320,260 380,380 260,380" fill="url(#snow-peak)" />
            <polygon points="560,190 630,310 490,310" fill="url(#snow-peak)" />

            {/* Glacial Rivers */}
            <path d="M 780 260 Q 650 380 520 460 T 220 580 T 0 680" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeOpacity="0.6" strokeDasharray="6 3" />

            {/* GPS Trek Trails */}
            <path
              d="M 180 580 Q 240 500 280 430 T 320 260"
              fill="none"
              stroke={activeTrekId === 'kedarkantha' ? '#facc15' : 'rgba(239,68,68,0.5)'}
              strokeWidth={activeTrekId === 'kedarkantha' ? '4' : '2'}
              strokeLinecap="round"
            />
            <path
              d="M 360 520 Q 420 420 480 340 T 560 190"
              fill="none"
              stroke={activeTrekId === 'rupin-pass' ? '#facc15' : 'rgba(239,68,68,0.5)'}
              strokeWidth={activeTrekId === 'rupin-pass' ? '4' : '2'}
              strokeLinecap="round"
            />
            <path
              d="M 220 580 Q 400 520 580 420 T 780 180"
              fill="none"
              stroke={activeTrekId === 'har-ki-dun' ? '#facc15' : 'rgba(239,68,68,0.5)'}
              strokeWidth={activeTrekId === 'har-ki-dun' ? '4' : '2'}
              strokeLinecap="round"
            />
          </svg>

          {/* Interactive 2D Waypoint Markers */}
          <div className="absolute inset-0 pointer-events-none">
            {WAYPOINTS.map((wp) => {
              const posX = 50 + (wp.x / 140) * 80;
              const posY = 50 + (wp.z / 140) * 70;
              const isSelected = selectedWaypoint?.name === wp.name;

              return (
                <div
                  key={wp.name}
                  style={{ left: `${posX}%`, top: `${posY}%` }}
                  className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onClick={() => {
                    setSelectedWaypoint(wp);
                    setActiveTrekId(wp.trekId);
                  }}
                >
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md transition-all shadow-lg ${
                      isSelected
                        ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-bold scale-110 ring-2 ring-yellow-400'
                        : 'bg-slate-900/90 text-white border-white/20 hover:border-yellow-400 hover:scale-105'
                    }`}
                  >
                    <Mountain className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-yellow-400'}`} />
                    <span className="text-xs font-['Rajdhani',sans-serif] font-bold whitespace-nowrap">
                      {wp.name}
                    </span>
                    <span className="text-[10px] font-mono opacity-80">{wp.altitude}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Safe 2D Fallback Notice Pill */}
          <div className="absolute bottom-28 left-4 sm:left-8 z-20 pointer-events-auto px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-['Rajdhani',sans-serif] flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">Topographic Satellite Telemetry Active</span>
            <span className="text-slate-500">•</span>
            <span>Click any waypoint or trek to inspect</span>
          </div>
        </div>
      )}

      {/* Top Google Earth Brand & Mode Banner */}
      <div className="absolute top-20 left-4 sm:left-8 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/20 shadow-2xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-yellow-400 p-0.5 shadow-md">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-white">
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest">
                3D SATELLITE TERRAIN
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-base font-black text-white font-['Rajdhani',sans-serif] tracking-wide">
              Uttarakhand Himalayan Satellite Globe
            </h2>
          </div>
        </div>

        {/* Quick Return to 360 Panorama View */}
        {onSwitchToPanorama && (
          <button
            onClick={onSwitchToPanorama}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-['Rajdhani',sans-serif] uppercase tracking-wider shadow-lg shadow-red-600/30 border border-yellow-400/40 active:scale-95 transition-all w-fit"
          >
            <Eye className="w-4 h-4 text-yellow-300" />
            <span>Return to 360° Ground Panorama</span>
          </button>
        )}
      </div>

      {/* Right Google Earth Controls Dock (Zoom, Reset North, Pitch Tilt, Auto-Rotate) */}
      <div className="absolute right-4 sm:right-8 top-28 z-20 flex flex-col items-center gap-2 pointer-events-auto">
        {/* Google Earth Compass Circle */}
        <button
          onClick={handleResetOrientation}
          className="group relative w-12 h-12 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:border-yellow-400 shadow-xl transition-all"
          title="Reset View to North (0°)"
        >
          <div
            className="transition-transform duration-200"
            style={{ transform: `rotate(${-headingBearing}deg)` }}
          >
            <Compass className="w-6 h-6 text-red-500" />
          </div>
          <span className="absolute -bottom-1 text-[9px] font-mono font-bold text-yellow-400">
            {headingBearing}°
          </span>
        </button>

        {/* Zoom In */}
        <button
          onClick={() => handleZoom('in')}
          className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-white/20 flex items-center justify-center text-slate-200 hover:text-white hover:border-yellow-400 transition-all shadow-md active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom('out')}
          className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-white/20 flex items-center justify-center text-slate-200 hover:text-white hover:border-yellow-400 transition-all shadow-md active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Tilt Toggle (3D / 2D) */}
        <button
          onClick={() => {
            const nextPhi = pitchAngle > 40 ? Math.PI / 6 : Math.PI / 3;
            controlsStateRef.current.phi = nextPhi;
            setPitchAngle(Math.round((nextPhi * 180) / Math.PI));
          }}
          className="w-10 h-10 rounded-xl bg-slate-950/85 backdrop-blur-xl border border-white/20 flex items-center justify-center text-xs font-mono font-bold text-yellow-400 hover:border-yellow-400 transition-all shadow-md"
          title="Toggle 3D Elevation Angle"
        >
          3D
        </button>

        {/* Auto Orbit */}
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`w-10 h-10 rounded-xl backdrop-blur-xl border flex items-center justify-center transition-all shadow-md ${
            isRotating
              ? 'bg-yellow-400 text-slate-950 border-yellow-300 font-bold'
              : 'bg-slate-950/85 text-slate-300 border-white/20 hover:text-white'
          }`}
          title="Toggle Auto Orbital Rotation"
        >
          <RotateCcw className={`w-4 h-4 ${isRotating ? 'animate-spin-slow' : ''}`} />
        </button>
      </div>

      {/* Top Center Trek Flight Switcher */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 max-w-xl w-full px-4 hidden md:flex items-center justify-center gap-2 pointer-events-auto">
        {TREKS_DATA.map((t) => {
          const isActive = t.id === activeTrekId;
          return (
            <button
              key={t.id}
              onClick={() => handleSelectTrek(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold font-['Rajdhani',sans-serif] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md ${
                isActive
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border border-yellow-400 scale-105'
                  : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-white/15'
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-yellow-400" />
              <span>{t.name.split(' ')[0]}</span>
              <span className="font-mono text-[10px] text-yellow-300">({t.altitudeFt}ft)</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Floating Info Card & GPS Elevation Profile for Selected Trek */}
      <div className="absolute bottom-4 left-4 right-4 sm:left-8 sm:right-auto sm:w-96 z-20 pointer-events-auto">
        <div className="p-4 rounded-3xl bg-slate-950/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-yellow-400/20 text-yellow-400 text-[10px] font-mono font-bold uppercase">
                GPS TRAIL ACTIVE
              </span>
              <span className="text-xs text-slate-400 font-mono">{activeTrek.region}</span>
            </div>

            <span className="text-sm font-mono font-black text-emerald-400">
              ₹{activeTrek.priceInr.toLocaleString()}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white font-['Rajdhani',sans-serif]">
              {activeTrek.name}
            </h3>
            <p className="text-xs text-slate-300 line-clamp-2 mt-1">
              {activeTrek.overview}
            </p>
          </div>

          {/* Quick Waypoint Selector */}
          <div className="pt-2 border-t border-white/10">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-['Rajdhani',sans-serif]">
              Key 3D Waypoints (Click to Fly)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {WAYPOINTS.filter((w) => w.trekId === activeTrekId).map((wp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedWaypoint(wp);
                    flyToLocation(wp.x, wp.y, wp.z, 45);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-slate-200 flex items-center gap-1 transition-all"
                >
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>{wp.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            {onSelectTrekForBooking && (
              <button
                onClick={() => onSelectTrekForBooking(activeTrek)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-bold text-xs uppercase tracking-wider font-['Rajdhani',sans-serif] shadow-lg shadow-red-600/30 border border-yellow-400/40 text-center"
              >
                Book This Trek
              </button>
            )}

            {onSwitchToPanorama && (
              <button
                onClick={onSwitchToPanorama}
                className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/15 text-xs font-bold font-['Rajdhani',sans-serif] uppercase"
                title="View in 360 Ground Panorama"
              >
                360° View
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Right Google Earth Telemetry HUD (Lat, Long, Camera Elevation) */}
      <div className="hidden sm:flex absolute bottom-4 right-8 z-20 items-center gap-4 px-4 py-2 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/15 text-[11px] font-mono text-slate-400 pointer-events-none">
        <div>
          <span className="text-slate-500">LAT:</span>{' '}
          <span className="text-slate-200 font-semibold">31.025° N</span>
        </div>
        <div>
          <span className="text-slate-500">LON:</span>{' '}
          <span className="text-slate-200 font-semibold">78.183° E</span>
        </div>
        <div>
          <span className="text-slate-500">EYE ALT:</span>{' '}
          <span className="text-yellow-400 font-bold">{cameraAltitude.toLocaleString()} FT</span>
        </div>
        <div>
          <span className="text-slate-500">PITCH:</span>{' '}
          <span className="text-emerald-400 font-semibold">{pitchAngle}°</span>
        </div>
      </div>
    </div>
  );
};
