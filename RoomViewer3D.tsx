import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { RoomDesign, FurnitureObject } from '../../types';
import {
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Trash2,
  Copy,
  Layers,
  Move,
  RotateCw,
  Sparkles,
  Info
} from 'lucide-react';

interface RoomViewer3DProps {
  roomDesign: RoomDesign;
  onUpdateDesign?: (updated: RoomDesign) => void;
  selectedObjectId?: string | null;
  onSelectObject?: (objId: string | null) => void;
  className?: string;
  isInteractive?: boolean;
}

export const RoomViewer3D: React.FC<RoomViewer3DProps> = ({
  roomDesign,
  onUpdateDesign,
  selectedObjectId = null,
  onSelectObject,
  className = '',
  isInteractive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isNight, setIsNight] = useState(roomDesign.lightingMood === 'moody');
  const [selectedObj, setSelectedObj] = useState<FurnitureObject | null>(null);
  const [hoveredObj, setHoveredObj] = useState<FurnitureObject | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectMeshesMap = useRef<Map<string, THREE.Object3D>>(new Map());

  // Orbit camera parameters
  const orbitRef = useRef({
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0,
    radius: 36,
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
    target: new THREE.Vector3(roomDesign.length / 2, 4, roomDesign.width / 2),
  });

  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi, target } = orbitRef.current;
    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  };

  const handleZoom = (delta: number) => {
    orbitRef.current.radius = Math.max(10, Math.min(65, orbitRef.current.radius + delta));
    updateCameraPosition();
  };

  const resetCamera = () => {
    orbitRef.current.theta = Math.PI / 4;
    orbitRef.current.phi = Math.PI / 3.4;
    orbitRef.current.radius = 36;
    orbitRef.current.target.set(roomDesign.length / 2, 4, roomDesign.width / 2);
    updateCameraPosition();
  };

  // Sync selected object with props
  useEffect(() => {
    if (selectedObjectId) {
      const found = roomDesign.objects.find((o) => o.id === selectedObjectId);
      setSelectedObj(found || null);
    } else {
      setSelectedObj(null);
    }
  }, [selectedObjectId, roomDesign.objects]);

  // Build the 3D Room Scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 450;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isNight ? 0x0B0F19 : 0xF1F5F9);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 200);
    cameraRef.current = camera;
    orbitRef.current.target.set(roomDesign.length / 2, 4, roomDesign.width / 2);
    updateCameraPosition();

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isNight ? 1.3 : 1.1;
    rendererRef.current = renderer;

    // Lights
    const hemiLight = new THREE.HemisphereLight(
      isNight ? 0x1E293B : 0xFFFFFF,
      isNight ? 0x020617 : 0xCBD5E1,
      isNight ? 0.3 : 0.8
    );
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(isNight ? 0x60A5FA : 0xFFFBEB, isNight ? 0.4 : 1.2);
    sunLight.position.set(roomDesign.length + 15, 30, roomDesign.width + 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Ceiling Inset Downlights
    const roomCenterLight = new THREE.PointLight(isNight ? 0xF59E0B : 0xFFFBEB, isNight ? 2.5 : 1.4, 30);
    roomCenterLight.position.set(roomDesign.length / 2, roomDesign.height - 1, roomDesign.width / 2);
    roomCenterLight.castShadow = true;
    scene.add(roomCenterLight);

    // Materials
    const floorColorMap: Record<string, number> = {
      'Hardwood Oak': 0xC8A27A,
      'Dark Walnut': 0x4A2E18,
      'Italian White Marble': 0xEDECE8,
      'Black Slate': 0x22262E,
      'Terrazzo Stone': 0xD1CCC0,
      'Polished Concrete': 0x8C929D,
      'Warm Beige Ceramic': 0xD8C4B6,
      'Herringbone Parquet': 0xB5835A,
    };
    const floorColor = floorColorMap[roomDesign.floorMaterial] || 0xC8A27A;

    const floorMat = new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: roomDesign.floorMaterial.includes('Marble') ? 0.2 : 0.6,
      metalness: 0.05,
    });

    const wallColorHex = parseInt(roomDesign.wallColor.replace('#', '0x')) || 0xF4F4F6;
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColorHex,
      roughness: 0.7,
      metalness: 0.02,
    });

    const cutWallMat = new THREE.MeshStandardMaterial({
      color: wallColorHex,
      roughness: 0.7,
      transparent: true,
      opacity: 0.4,
    });

    // 1. FLOOR
    const floorGeo = new THREE.BoxGeometry(roomDesign.length, 0.4, roomDesign.width);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(roomDesign.length / 2, -0.2, roomDesign.width / 2);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // 2. CUTAWAY WALLS (Back and Left wall full, Front and Right wall low for 3D visibility)
    // Back Wall (Y = 0)
    const backWallGeo = new THREE.BoxGeometry(roomDesign.length, roomDesign.height, 0.4);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(roomDesign.length / 2, roomDesign.height / 2, -0.2);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    scene.add(backWall);

    // Left Wall (X = 0)
    const leftWallGeo = new THREE.BoxGeometry(0.4, roomDesign.height, roomDesign.width);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.position.set(-0.2, roomDesign.height / 2, roomDesign.width / 2);
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    scene.add(leftWall);

    // Front Wall Low (Z = width)
    const frontWallGeo = new THREE.BoxGeometry(roomDesign.length, 1.2, 0.4);
    const frontWall = new THREE.Mesh(frontWallGeo, cutWallMat);
    frontWall.position.set(roomDesign.length / 2, 0.6, roomDesign.width + 0.2);
    scene.add(frontWall);

    // Right Wall Low (X = length)
    const rightWallGeo = new THREE.BoxGeometry(0.4, 1.2, roomDesign.width);
    const rightWall = new THREE.Mesh(rightWallGeo, cutWallMat);
    rightWall.position.set(roomDesign.length + 0.2, 0.6, roomDesign.width / 2);
    scene.add(rightWall);

    // Baseboard Trims
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x2A2D34, roughness: 0.4 });
    const trimBack = new THREE.Mesh(new THREE.BoxGeometry(roomDesign.length, 0.4, 0.1), trimMat);
    trimBack.position.set(roomDesign.length / 2, 0.2, 0.05);
    scene.add(trimBack);

    // 3. FURNITURE MESHES
    objectMeshesMap.current.clear();
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);

    roomDesign.objects.forEach((obj) => {
      const objGroup = new THREE.Group();
      objGroup.position.set(obj.x + obj.width / 2, obj.z || 0, obj.y + obj.depth / 2);
      objGroup.rotation.y = (obj.rotation * Math.PI) / 180;
      objGroup.name = obj.id;

      const objColorHex = parseInt((obj.color || '#64748B').replace('#', '0x')) || 0x64748B;
      const isSelected = selectedObjectId === obj.id;

      const baseMat = new THREE.MeshStandardMaterial({
        color: objColorHex,
        roughness: 0.5,
        metalness: 0.1,
        emissive: isSelected ? 0x3B82F6 : 0x000000,
        emissiveIntensity: isSelected ? 0.35 : 0,
      });

      // Distinct 3D Geometries based on Object Type
      if (obj.type === 'sofa') {
        // Sofa Base
        const seat = new THREE.Mesh(new THREE.BoxGeometry(obj.width, obj.height * 0.45, obj.depth), baseMat);
        seat.position.y = obj.height * 0.225;
        seat.castShadow = true;
        seat.receiveShadow = true;
        objGroup.add(seat);

        // Sofa Backrest
        const back = new THREE.Mesh(new THREE.BoxGeometry(obj.width, obj.height * 0.55, obj.depth * 0.25), baseMat);
        back.position.set(0, obj.height * 0.6, -obj.depth * 0.35);
        back.castShadow = true;
        objGroup.add(back);

        // Armrests
        const armGeo = new THREE.BoxGeometry(obj.width * 0.12, obj.height * 0.45, obj.depth * 0.8);
        const armL = new THREE.Mesh(armGeo, baseMat);
        armL.position.set(-obj.width * 0.44, obj.height * 0.4, 0);
        const armR = new THREE.Mesh(armGeo, baseMat);
        armR.position.set(obj.width * 0.44, obj.height * 0.4, 0);
        objGroup.add(armL, armR);
      } else if (obj.type === 'center_table' || obj.type === 'dining_table' || obj.type === 'desk') {
        // Table Top
        const top = new THREE.Mesh(new THREE.BoxGeometry(obj.width, 0.2, obj.depth), baseMat);
        top.position.y = obj.height - 0.1;
        top.castShadow = true;
        objGroup.add(top);

        // Table Legs
        const legMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.3, metalness: 0.6 });
        const legGeo = new THREE.CylinderGeometry(0.12, 0.12, obj.height - 0.2, 8);
        [
          [-obj.width * 0.42, -obj.depth * 0.42],
          [obj.width * 0.42, -obj.depth * 0.42],
          [-obj.width * 0.42, obj.depth * 0.42],
          [obj.width * 0.42, obj.depth * 0.42],
        ].forEach(([lx, lz]) => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(lx, (obj.height - 0.2) / 2, lz);
          leg.castShadow = true;
          objGroup.add(leg);
        });
      } else if (obj.type === 'bed') {
        // Bed Mattress & Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(obj.width, obj.height * 0.35, obj.depth), baseMat);
        base.position.y = obj.height * 0.175;
        base.castShadow = true;
        objGroup.add(base);

        const mattressMat = new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.8 });
        const mattress = new THREE.Mesh(new THREE.BoxGeometry(obj.width * 0.94, obj.height * 0.25, obj.depth * 0.94), mattressMat);
        mattress.position.y = obj.height * 0.45;
        mattress.castShadow = true;
        objGroup.add(mattress);

        // Headboard
        const headboard = new THREE.Mesh(new THREE.BoxGeometry(obj.width, obj.height * 0.6, obj.depth * 0.12), baseMat);
        headboard.position.set(0, obj.height * 0.65, -obj.depth * 0.44);
        headboard.castShadow = true;
        objGroup.add(headboard);
      } else if (obj.type === 'bathtub') {
        const tub = new THREE.Mesh(new THREE.BoxGeometry(obj.width, obj.height, obj.depth), baseMat);
        tub.position.y = obj.height / 2;
        tub.castShadow = true;
        objGroup.add(tub);
      } else if (obj.type === 'tv' || obj.type === 'tv_unit') {
        const screen = new THREE.Mesh(new THREE.BoxGeometry(obj.width, obj.height, obj.depth), baseMat);
        screen.position.y = obj.height / 2;
        screen.castShadow = true;
        objGroup.add(screen);
      } else if (obj.type === 'rug') {
        const rug = new THREE.Mesh(new THREE.BoxGeometry(obj.width, 0.05, obj.depth), baseMat);
        rug.position.y = 0.025;
        rug.receiveShadow = true;
        objGroup.add(rug);
      } else if (obj.type === 'plant') {
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(obj.width * 0.4, obj.width * 0.3, obj.height * 0.4, 12), baseMat);
        pot.position.y = obj.height * 0.2;
        objGroup.add(pot);

        const plantFoliageMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.7 });
        const foliage = new THREE.Mesh(new THREE.SphereGeometry(obj.width * 0.55, 12, 12), plantFoliageMat);
        foliage.position.y = obj.height * 0.65;
        foliage.castShadow = true;
        objGroup.add(foliage);
      } else {
        // Generic architectural box
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(obj.width, obj.height, obj.depth), baseMat);
        mesh.position.y = obj.height / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        objGroup.add(mesh);
      }

      // Selection bounding highlight ring
      if (isSelected) {
        const outlineGeo = new THREE.BoxGeometry(obj.width + 0.3, obj.height + 0.3, obj.depth + 0.3);
        const outlineMat = new THREE.MeshBasicMaterial({ color: 0x3B82F6, wireframe: true });
        const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
        outlineMesh.position.y = obj.height / 2;
        objGroup.add(outlineMesh);
      }

      furnitureGroup.add(objGroup);
      objectMeshesMap.current.set(obj.id, objGroup);
    });

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Raycaster for Furniture Click / Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedObj = (clientX: number, clientY: number): FurnitureObject | null => {
      if (!containerRef.current || !cameraRef.current) return null;
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(furnitureGroup.children, true);

      if (intersects.length > 0) {
        let topObj: THREE.Object3D | null = intersects[0].object;
        while (topObj && topObj.parent !== furnitureGroup) {
          topObj = topObj.parent;
        }
        if (topObj && topObj.name) {
          return roomDesign.objects.find((o) => o.id === topObj?.name) || null;
        }
      }
      return null;
    };

    const onPointerDown = (e: MouseEvent) => {
      orbitRef.current.isMouseDown = true;
      orbitRef.current.mouseX = e.clientX;
      orbitRef.current.mouseY = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      if (orbitRef.current.isMouseDown) {
        const deltaX = e.clientX - orbitRef.current.mouseX;
        const deltaY = e.clientY - orbitRef.current.mouseY;
        orbitRef.current.mouseX = e.clientX;
        orbitRef.current.mouseY = e.clientY;

        orbitRef.current.theta -= deltaX * 0.008;
        orbitRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, orbitRef.current.phi - deltaY * 0.008));
        updateCameraPosition();
      } else {
        // Hover object detection
        const found = getIntersectedObj(e.clientX, e.clientY);
        setHoveredObj(found);
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      const movedDist = Math.hypot(e.clientX - orbitRef.current.mouseX, e.clientY - orbitRef.current.mouseY);
      orbitRef.current.isMouseDown = false;

      // Click selection
      if (movedDist < 5 && isInteractive) {
        const clicked = getIntersectedObj(e.clientX, e.clientY);
        setSelectedObj(clicked);
        if (onSelectObject) onSelectObject(clicked ? clicked.id : null);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleZoom(e.deltaY * 0.03);
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [roomDesign, isNight, selectedObjectId, isInteractive]);

  // Object Live Transformation Helpers (2D <-> 3D Synchronized)
  const updateSelectedObjectProp = (key: keyof FurnitureObject, value: any) => {
    if (!selectedObj || !onUpdateDesign) return;
    const updatedObjects = roomDesign.objects.map((obj) => {
      if (obj.id === selectedObj.id) {
        return { ...obj, [key]: value };
      }
      return obj;
    });
    const updatedRoom: RoomDesign = {
      ...roomDesign,
      objects: updatedObjects,
    };
    onUpdateDesign(updatedRoom);
    setSelectedObj({ ...selectedObj, [key]: value });
  };

  const deleteSelectedObject = () => {
    if (!selectedObj || !onUpdateDesign) return;
    const updatedObjects = roomDesign.objects.filter((obj) => obj.id !== selectedObj.id);
    onUpdateDesign({ ...roomDesign, objects: updatedObjects });
    setSelectedObj(null);
    if (onSelectObject) onSelectObject(null);
  };

  const duplicateSelectedObject = () => {
    if (!selectedObj || !onUpdateDesign) return;
    const newObj: FurnitureObject = {
      ...selectedObj,
      id: `${selectedObj.type}_${Date.now()}`,
      name: `${selectedObj.name} (Copy)`,
      x: Math.min(roomDesign.length - selectedObj.width - 1, selectedObj.x + 2),
      y: Math.min(roomDesign.width - selectedObj.depth - 1, selectedObj.y + 2),
    };
    onUpdateDesign({
      ...roomDesign,
      objects: [...roomDesign.objects, newObj],
    });
    setSelectedObj(newObj);
    if (onSelectObject) onSelectObject(newObj.id);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const activeInfoObj = selectedObj || hoveredObj;

  return (
    <div
      ref={containerRef}
      id="room_3d_viewport_container"
      className={`relative w-full h-full min-h-[420px] bg-slate-950 rounded-2xl overflow-hidden shadow-xl select-none ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        {/* Room Header Pill */}
        <div className="px-3 py-1.5 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-lg text-xs pointer-events-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white truncate max-w-[200px]">{roomDesign.name}</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {roomDesign.length} × {roomDesign.width} ft ({roomDesign.area} sq ft)
          </span>
        </div>

        {/* View Actions */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsNight(!isNight)}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all shadow-md flex items-center gap-1 ${
              isNight ? 'bg-indigo-900/60 border-indigo-400 text-indigo-200' : 'bg-amber-500/20 border-amber-400 text-amber-200'
            }`}
          >
            {isNight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isNight ? 'NIGHT' : 'DAY'}</span>
          </button>
          <button
            onClick={resetCamera}
            className="p-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/60 text-slate-300 hover:text-white"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/60 text-slate-300 hover:text-white"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Floating 3D Object Information & Label HUD */}
      {activeInfoObj && (
        <div className="absolute top-14 left-3 p-2.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-blue-500/40 shadow-xl text-xs max-w-[280px] pointer-events-auto transition-all">
          <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="font-bold text-white text-xs">{activeInfoObj.name}</span>
            </div>
            <span className="text-[10px] text-blue-400 uppercase font-mono tracking-wider">{activeInfoObj.type}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-300 font-mono">
            <div>
              <span className="text-slate-500">Dimensions:</span> {activeInfoObj.width}×{activeInfoObj.depth}×{activeInfoObj.height} ft
            </div>
            <div>
              <span className="text-slate-500">Position:</span> ({activeInfoObj.x.toFixed(1)}, {activeInfoObj.y.toFixed(1)})
            </div>
            <div>
              <span className="text-slate-500">Rotation:</span> {activeInfoObj.rotation}°
            </div>
            <div>
              <span className="text-slate-500">Material:</span> {activeInfoObj.material || 'Standard'}
            </div>
          </div>
        </div>
      )}

      {/* Selected Object 3D Transformation Gizmo HUD (Bottom Controls) */}
      {selectedObj && isInteractive && onUpdateDesign && (
        <div className="absolute bottom-3 left-3 right-3 p-3 bg-slate-900/95 backdrop-blur-md rounded-xl border border-blue-500/50 shadow-2xl pointer-events-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Position and Rotation Controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-slate-400">X:</span>
                <input
                  type="range"
                  min="0"
                  max={roomDesign.length - selectedObj.width}
                  step="0.5"
                  value={selectedObj.x}
                  onChange={(e) => updateSelectedObjectProp('x', parseFloat(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded appearance-none accent-blue-500"
                />
                <span className="text-white font-mono">{selectedObj.x.toFixed(1)}ft</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Y:</span>
                <input
                  type="range"
                  min="0"
                  max={roomDesign.width - selectedObj.depth}
                  step="0.5"
                  value={selectedObj.y}
                  onChange={(e) => updateSelectedObjectProp('y', parseFloat(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded appearance-none accent-blue-500"
                />
                <span className="text-white font-mono">{selectedObj.y.toFixed(1)}ft</span>
              </div>

              <div className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Rot:</span>
                <button
                  onClick={() => updateSelectedObjectProp('rotation', (selectedObj.rotation + 45) % 360)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-mono text-[11px]"
                >
                  {selectedObj.rotation}° (+45°)
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Color:</span>
                <input
                  type="color"
                  value={selectedObj.color || '#64748B'}
                  onChange={(e) => updateSelectedObjectProp('color', e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                />
              </div>
            </div>

            {/* Quick Actions (Duplicate, Delete, Deselect) */}
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                onClick={duplicateSelectedObject}
                className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                title="Duplicate Object"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Duplicate</span>
              </button>
              <button
                onClick={deleteSelectedObject}
                className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-900/50 hover:bg-red-800 text-red-200 rounded-lg transition-colors border border-red-700/50"
                title="Delete Object"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Drag & Selection Prompt */}
      {!selectedObj && (
        <div className="absolute bottom-3 left-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-slate-400 border border-white/5">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Click any 3D furniture to inspect & transform • Drag to rotate scene</span>
        </div>
      )}
    </div>
  );
};
