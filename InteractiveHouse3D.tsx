import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { ExteriorOptions, FloorLevel } from '../../types';
import {
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Eye,
  Layers,
  Sparkles,
  Home,
  Sliders
} from 'lucide-react';

interface InteractiveHouse3DProps {
  exterior?: ExteriorOptions;
  selectedFloor?: 'all' | FloorLevel;
  explodedOffset?: number; // 0 to 1
  cutawayMode?: boolean;
  onFloorSelect?: (floor: 'all' | FloorLevel) => void;
  className?: string;
  showControls?: boolean;
  nightMode?: boolean;
  onToggleNightMode?: (isNight: boolean) => void;
}

export const InteractiveHouse3D: React.FC<InteractiveHouse3DProps> = ({
  exterior = {
    wallColor: '#F4F4F6',
    wallTexture: 'smooth',
    roofStyle: 'modern_flat',
    roofColor: '#2B2D42',
    windowTint: 'clear',
    balconyGlass: true,
    gateStyle: 'modern_slat',
    nightLighting: false,
    hasPool: true,
    hasGarden: true,
    hasCar: true,
    louverAccents: true,
  },
  selectedFloor = 'all',
  explodedOffset = 0,
  cutawayMode = false,
  onFloorSelect,
  className = '',
  showControls = true,
  nightMode = false,
  onToggleNightMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFloor, setActiveFloor] = useState<'all' | FloorLevel>(selectedFloor);
  const [localExploded, setLocalExploded] = useState(explodedOffset);
  const [isNight, setIsNight] = useState(nightMode);
  const [isCutaway, setIsCutaway] = useState(cutawayMode);

  // Sync props
  useEffect(() => {
    setActiveFloor(selectedFloor);
  }, [selectedFloor]);

  useEffect(() => {
    setLocalExploded(explodedOffset);
  }, [explodedOffset]);

  useEffect(() => {
    setIsNight(nightMode);
  }, [nightMode]);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const groundGroupRef = useRef<THREE.Group | null>(null);
  const floor1GroupRef = useRef<THREE.Group | null>(null);
  const floor2GroupRef = useRef<THREE.Group | null>(null);
  const roofGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Camera Orbit State
  const orbitRef = useRef({
    isMouseDown: false,
    mouseX: 0,
    mouseY: 0,
    radius: 42,
    theta: Math.PI / 4, // 45 deg
    phi: Math.PI / 3.2, // ~56 deg
    target: new THREE.Vector3(0, 5, 0),
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

  // View Presets
  const setViewPreset = (view: 'front' | 'back' | 'left' | 'right' | 'top' | 'iso' | 'reset') => {
    const o = orbitRef.current;
    if (view === 'front') {
      o.theta = 0;
      o.phi = Math.PI / 2.3;
      o.radius = 38;
    } else if (view === 'back') {
      o.theta = Math.PI;
      o.phi = Math.PI / 2.3;
      o.radius = 38;
    } else if (view === 'left') {
      o.theta = -Math.PI / 2;
      o.phi = Math.PI / 2.3;
      o.radius = 38;
    } else if (view === 'right') {
      o.theta = Math.PI / 2;
      o.phi = Math.PI / 2.3;
      o.radius = 38;
    } else if (view === 'top') {
      o.theta = 0.01;
      o.phi = 0.05;
      o.radius = 48;
    } else {
      // iso / reset
      o.theta = Math.PI / 4;
      o.phi = Math.PI / 3.2;
      o.radius = 42;
      o.target.set(0, 5, 0);
    }
    updateCameraPosition();
  };

  const handleZoom = (delta: number) => {
    orbitRef.current.radius = Math.max(12, Math.min(80, orbitRef.current.radius + delta));
    updateCameraPosition();
  };

  // Build the complete 3D House Model
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(isNight ? 0x090D16 : 0xF0F4F8);
    scene.fog = new THREE.FogExp2(isNight ? 0x090D16 : 0xF0F4F8, 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 500);
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer
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
    renderer.toneMappingExposure = isNight ? 1.4 : 1.1;
    rendererRef.current = renderer;

    // Lights
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    const hemiLight = new THREE.HemisphereLight(
      isNight ? 0x1E293B : 0xFFFFFF,
      isNight ? 0x020617 : 0xCBD5E1,
      isNight ? 0.35 : 0.85
    );
    hemiLightRef.current = hemiLight;
    lightsGroup.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(
      isNight ? 0x60A5FA : 0xFFFBEB,
      isNight ? 0.4 : 1.4
    );
    dirLight.position.set(25, 45, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.bias = -0.0005;
    dirLightRef.current = dirLight;
    lightsGroup.add(dirLight);

    // Night Accent Lights
    if (isNight) {
      // Warm interior point lights
      const interiorGlow1 = new THREE.PointLight(0xF59E0B, 2.8, 25);
      interiorGlow1.position.set(0, 3.5, 0);
      lightsGroup.add(interiorGlow1);

      const interiorGlow2 = new THREE.PointLight(0xFBBF24, 2.5, 25);
      interiorGlow2.position.set(0, 10, 0);
      lightsGroup.add(interiorGlow2);

      // Garden & Entry Spotlights
      const porchSpot = new THREE.SpotLight(0xFDE68A, 3.5, 18, Math.PI / 3, 0.4);
      porchSpot.position.set(0, 6, 12);
      porchSpot.target.position.set(0, 0, 12);
      lightsGroup.add(porchSpot);
      lightsGroup.add(porchSpot.target);

      // Pool cyan glow
      const poolLight = new THREE.PointLight(0x06B6D4, 2.2, 14);
      poolLight.position.set(13, 0.2, 6);
      lightsGroup.add(poolLight);
    }

    // Material Library
    const wallColorHex = parseInt(exterior.wallColor.replace('#', '0x')) || 0xF4F4F6;
    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColorHex,
      roughness: 0.45,
      metalness: 0.05,
      transparent: isCutaway,
      opacity: isCutaway ? 0.35 : 1.0,
    });

    const darkAccentMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.3,
      metalness: 0.2,
    });

    const timberMat = new THREE.MeshStandardMaterial({
      color: 0x9A6B44,
      roughness: 0.6,
      metalness: 0.05,
    });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x94A3B8,
      roughness: 0.8,
      metalness: 0.02,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: isNight ? 0xFDE68A : 0xA0C4DF,
      transmission: isNight ? 0.4 : 0.85,
      opacity: 1,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      emissive: isNight ? new THREE.Color(0xF59E0B) : new THREE.Color(0x000000),
      emissiveIntensity: isNight ? 0.45 : 0,
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: parseInt(exterior.roofColor.replace('#', '0x')) || 0x2B2D42,
      roughness: 0.4,
      metalness: 0.1,
    });

    // 1. SITE & LANDSCAPE
    const siteGroup = new THREE.Group();
    scene.add(siteGroup);

    // Land base
    const landGeo = new THREE.BoxGeometry(46, 0.8, 38);
    const grassMat = new THREE.MeshStandardMaterial({ color: isNight ? 0x142B1B : 0x4B7A38, roughness: 0.9 });
    const landMesh = new THREE.Mesh(landGeo, grassMat);
    landMesh.position.set(0, -0.4, 0);
    landMesh.receiveShadow = true;
    siteGroup.add(landMesh);

    // Driveway & Walkway
    const drivewayGeo = new THREE.BoxGeometry(10, 0.05, 16);
    const paveMat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.7 });
    const drivewayMesh = new THREE.Mesh(drivewayGeo, paveMat);
    drivewayMesh.position.set(-13, 0.03, 10);
    drivewayMesh.receiveShadow = true;
    siteGroup.add(drivewayMesh);

    // Swimming Pool with Deck
    if (exterior.hasPool) {
      const poolDeckGeo = new THREE.BoxGeometry(12, 0.1, 14);
      const poolDeckMesh = new THREE.Mesh(poolDeckGeo, timberMat);
      poolDeckMesh.position.set(14, 0.05, 5);
      siteGroup.add(poolDeckMesh);

      const poolWaterGeo = new THREE.BoxGeometry(8, 0.2, 10);
      const poolWaterMat = new THREE.MeshStandardMaterial({
        color: 0x0EA5E9,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
        emissive: isNight ? new THREE.Color(0x0284C7) : new THREE.Color(0x000000),
        emissiveIntensity: isNight ? 0.3 : 0,
      });
      const poolWaterMesh = new THREE.Mesh(poolWaterGeo, poolWaterMat);
      poolWaterMesh.position.set(14, 0.1, 5);
      siteGroup.add(poolWaterMesh);
    }

    // Boundary Walls & Gate
    const bWallBackGeo = new THREE.BoxGeometry(45, 2.5, 0.5);
    const bWallBack = new THREE.Mesh(bWallBackGeo, wallMat);
    bWallBack.position.set(0, 1.25, -18.5);
    bWallBack.castShadow = true;
    siteGroup.add(bWallBack);

    const bWallLeftGeo = new THREE.BoxGeometry(0.5, 2.5, 37);
    const bWallLeft = new THREE.Mesh(bWallLeftGeo, wallMat);
    bWallLeft.position.set(-22.5, 1.25, 0);
    bWallLeft.castShadow = true;
    siteGroup.add(bWallLeft);

    const bWallRight = new THREE.Mesh(bWallLeftGeo, wallMat);
    bWallRight.position.set(22.5, 1.25, 0);
    bWallRight.castShadow = true;
    siteGroup.add(bWallRight);

    // Front Gate
    const gateColGeo = new THREE.BoxGeometry(1.2, 3, 1.2);
    const gateCol1 = new THREE.Mesh(gateColGeo, darkAccentMat);
    gateCol1.position.set(-8, 1.5, 18.5);
    siteGroup.add(gateCol1);

    const gateCol2 = new THREE.Mesh(gateColGeo, darkAccentMat);
    gateCol2.position.set(-18, 1.5, 18.5);
    siteGroup.add(gateCol2);

    const gateLeafGeo = new THREE.BoxGeometry(9, 2.4, 0.2);
    const gateMesh = new THREE.Mesh(gateLeafGeo, darkAccentMat);
    gateMesh.position.set(-13, 1.2, 18.5);
    siteGroup.add(gateMesh);

    // Modern Car in Driveway
    if (exterior.hasCar) {
      const carGroup = new THREE.Group();
      carGroup.position.set(-13, 0.5, 9);

      const carBodyGeo = new THREE.BoxGeometry(4.5, 1.3, 8.5);
      const carPaintMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.2, metalness: 0.8 });
      const carBody = new THREE.Mesh(carBodyGeo, carPaintMat);
      carBody.position.set(0, 0.7, 0);
      carBody.castShadow = true;
      carGroup.add(carBody);

      const carCabinGeo = new THREE.BoxGeometry(4, 1.1, 4.5);
      const carCabin = new THREE.Mesh(carCabinGeo, glassMat);
      carCabin.position.set(0, 1.7, -0.5);
      carCabin.castShadow = true;
      carGroup.add(carCabin);

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.9 });
      wheelGeo.rotateZ(Math.PI / 2);
      [[-2.3, 0.5, 2.5], [2.3, 0.5, 2.5], [-2.3, 0.5, -2.5], [2.3, 0.5, -2.5]].forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.position.set(wx, wy, wz);
        carGroup.add(wheel);
      });

      siteGroup.add(carGroup);
    }

    // Trees & Shrubs
    if (exterior.hasGarden) {
      const createTree = (tx: number, tz: number, scale = 1) => {
        const treeGroup = new THREE.Group();
        treeGroup.position.set(tx, 0, tz);

        const trunkGeo = new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 3 * scale, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4A3525, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.5 * scale;
        trunk.castShadow = true;
        treeGroup.add(trunk);

        const crownGeo = new THREE.ConeGeometry(2.2 * scale, 5 * scale, 8);
        const crownMat = new THREE.MeshStandardMaterial({ color: isNight ? 0x0F291E : 0x2D5A27, roughness: 0.8 });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.y = 4.5 * scale;
        crown.castShadow = true;
        treeGroup.add(crown);

        siteGroup.add(treeGroup);
      };

      createTree(-19, -14, 1.2);
      createTree(18, -14, 1.3);
      createTree(19, 14, 1.0);
      createTree(10, 14, 0.8);
    }

    // 2. GROUND FLOOR GROUP
    const groundGroup = new THREE.Group();
    groundGroupRef.current = groundGroup;
    scene.add(groundGroup);

    // Ground Floor Slab
    const gfSlabGeo = new THREE.BoxGeometry(26, 0.4, 20);
    const gfSlab = new THREE.Mesh(gfSlabGeo, concreteMat);
    gfSlab.position.set(0, 0.2, 0);
    gfSlab.receiveShadow = true;
    groundGroup.add(gfSlab);

    // GF Main Walls
    const gfMainWallGeo = new THREE.BoxGeometry(25.6, 5.6, 19.6);
    const gfMainWall = new THREE.Mesh(gfMainWallGeo, wallMat);
    gfMainWall.position.set(0, 3.2, 0);
    gfMainWall.castShadow = true;
    gfMainWall.receiveShadow = true;
    groundGroup.add(gfMainWall);

    // GF Timber Entrance Porch & Double Doors
    const porchGeo = new THREE.BoxGeometry(8, 5.8, 3);
    const porchMesh = new THREE.Mesh(porchGeo, timberMat);
    porchMesh.position.set(-4, 3.2, 9.8);
    porchMesh.castShadow = true;
    groundGroup.add(porchMesh);

    const mainDoorGeo = new THREE.BoxGeometry(3.5, 4.5, 0.3);
    const mainDoorMesh = new THREE.Mesh(mainDoorGeo, darkAccentMat);
    mainDoorMesh.position.set(-4, 2.5, 11.4);
    groundGroup.add(mainDoorMesh);

    // GF Large Glass Windows
    const gfWindowGeo1 = new THREE.BoxGeometry(8.5, 4.2, 0.4);
    const gfWindow1 = new THREE.Mesh(gfWindowGeo1, glassMat);
    gfWindow1.position.set(6, 3.2, 10);
    groundGroup.add(gfWindow1);

    const gfWindowGeoSide = new THREE.BoxGeometry(0.4, 4.2, 10);
    const gfWindowSide = new THREE.Mesh(gfWindowGeoSide, glassMat);
    gfWindowSide.position.set(13, 3.2, 0);
    groundGroup.add(gfWindowSide);

    // Louver accents on Ground Floor
    if (exterior.louverAccents) {
      const louverBox = new THREE.BoxGeometry(4, 5.6, 0.2);
      const louverMesh = new THREE.Mesh(louverBox, timberMat);
      louverMesh.position.set(11, 3.2, 10.1);
      groundGroup.add(louverMesh);
    }

    // 3. FIRST FLOOR GROUP
    const floor1Group = new THREE.Group();
    floor1GroupRef.current = floor1Group;
    scene.add(floor1Group);

    // 1F Cantilevered Slab
    const f1SlabGeo = new THREE.BoxGeometry(28, 0.5, 22);
    const f1Slab = new THREE.Mesh(f1SlabGeo, darkAccentMat);
    f1Slab.position.set(1, 6.2, 1);
    f1Slab.castShadow = true;
    f1Slab.receiveShadow = true;
    floor1Group.add(f1Slab);

    // 1F Main Walls
    const f1WallGeo = new THREE.BoxGeometry(24, 5.6, 18);
    const f1Wall = new THREE.Mesh(f1WallGeo, wallMat);
    f1Wall.position.set(0, 9.2, 0);
    f1Wall.castShadow = true;
    f1Wall.receiveShadow = true;
    floor1Group.add(f1Wall);

    // 1F Master Balcony (Front Cantilever)
    const balconyFloorGeo = new THREE.BoxGeometry(12, 0.3, 4);
    const balconyFloor = new THREE.Mesh(balconyFloorGeo, darkAccentMat);
    balconyFloor.position.set(5, 6.4, 10.5);
    balconyFloor.castShadow = true;
    floor1Group.add(balconyFloor);

    // Balcony Glass Railing
    const railingGeo = new THREE.BoxGeometry(12, 1.8, 0.1);
    const railingMesh = new THREE.Mesh(railingGeo, glassMat);
    railingMesh.position.set(5, 7.4, 12.4);
    floor1Group.add(railingMesh);

    // 1F Panoramic Sliding Glass Windows
    const f1GlassGeo = new THREE.BoxGeometry(10, 4.4, 0.3);
    const f1Glass = new THREE.Mesh(f1GlassGeo, glassMat);
    f1Glass.position.set(5, 9.2, 9.2);
    floor1Group.add(f1Glass);

    // 1F Modern Wood Slat Box
    const f1WoodBoxGeo = new THREE.BoxGeometry(8, 5.4, 2);
    const f1WoodBox = new THREE.Mesh(f1WoodBoxGeo, timberMat);
    f1WoodBox.position.set(-7, 9.2, 9);
    f1WoodBox.castShadow = true;
    floor1Group.add(f1WoodBox);

    // 4. SECOND FLOOR / ROOFTOP TERRACE GROUP
    const floor2Group = new THREE.Group();
    floor2GroupRef.current = floor2Group;
    scene.add(floor2Group);

    // 2F Slab
    const f2SlabGeo = new THREE.BoxGeometry(26, 0.5, 20);
    const f2Slab = new THREE.Mesh(f2SlabGeo, darkAccentMat);
    f2Slab.position.set(0, 12.2, 0);
    f2Slab.castShadow = true;
    floor2Group.add(f2Slab);

    // 2F Penthouse Lounge
    const f2LoungeGeo = new THREE.BoxGeometry(14, 5.2, 12);
    const f2Lounge = new THREE.Mesh(f2LoungeGeo, wallMat);
    f2Lounge.position.set(-4, 15, -2);
    f2Lounge.castShadow = true;
    floor2Group.add(f2Lounge);

    // 2F Glass Front
    const f2GlassGeo = new THREE.BoxGeometry(12, 4.2, 0.3);
    const f2Glass = new THREE.Mesh(f2GlassGeo, glassMat);
    f2Glass.position.set(-4, 15, 4.2);
    floor2Group.add(f2Glass);

    // 2F Rooftop Terrace Pergola
    const pergolaBeamGeo = new THREE.BoxGeometry(10, 0.4, 0.4);
    for (let pz = -4; pz <= 6; pz += 2) {
      const pBeam = new THREE.Mesh(pergolaBeamGeo, timberMat);
      pBeam.position.set(7, 18, pz);
      floor2Group.add(pBeam);
    }

    // 2F Terrace Glass Railing
    const f2RailingGeo = new THREE.BoxGeometry(10, 1.8, 0.1);
    const f2Railing = new THREE.Mesh(f2RailingGeo, glassMat);
    f2Railing.position.set(7, 13.2, 9.8);
    floor2Group.add(f2Railing);

    // 5. ROOF GROUP
    const roofGroup = new THREE.Group();
    roofGroupRef.current = roofGroup;
    scene.add(roofGroup);

    if (exterior.roofStyle === 'modern_flat') {
      const roofCapGeo = new THREE.BoxGeometry(16, 0.6, 14);
      const roofCap = new THREE.Mesh(roofCapGeo, roofMat);
      roofCap.position.set(-4, 17.8, -2);
      roofCap.castShadow = true;
      roofGroup.add(roofCap);
    } else if (exterior.roofStyle === 'cantilever_terrace') {
      const roofOverhangGeo = new THREE.BoxGeometry(20, 0.6, 16);
      const roofOverhang = new THREE.Mesh(roofOverhangGeo, roofMat);
      roofOverhang.position.set(-2, 18.2, -1);
      roofOverhang.castShadow = true;
      roofGroup.add(roofOverhang);
    } else {
      // Slanted pitch roof
      const pitchGeo = new THREE.ConeGeometry(12, 4, 4);
      pitchGeo.rotateY(Math.PI / 4);
      const pitchMesh = new THREE.Mesh(pitchGeo, roofMat);
      pitchMesh.position.set(-4, 19.5, -2);
      pitchMesh.castShadow = true;
      roofGroup.add(pitchMesh);
    }

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Mouse Drag Rotation Handler
    const canvas = canvasRef.current;
    const onMouseDown = (e: MouseEvent) => {
      orbitRef.current.isMouseDown = true;
      orbitRef.current.mouseX = e.clientX;
      orbitRef.current.mouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!orbitRef.current.isMouseDown) return;
      const deltaX = e.clientX - orbitRef.current.mouseX;
      const deltaY = e.clientY - orbitRef.current.mouseY;
      orbitRef.current.mouseX = e.clientX;
      orbitRef.current.mouseY = e.clientY;

      orbitRef.current.theta -= deltaX * 0.008;
      orbitRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, orbitRef.current.phi - deltaY * 0.008));
      updateCameraPosition();
    };

    const onMouseUp = () => {
      orbitRef.current.isMouseDown = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      handleZoom(e.deltaY * 0.03);
    };

    // Touch support for mobile/tablet
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        orbitRef.current.isMouseDown = true;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!orbitRef.current.isMouseDown || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      orbitRef.current.theta -= deltaX * 0.01;
      orbitRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, orbitRef.current.phi - deltaY * 0.01));
      updateCameraPosition();
    };
    const onTouchEnd = () => {
      orbitRef.current.isMouseDown = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [isNight, exterior, isCutaway]);

  // Floor Isolation and Exploded View logic
  useEffect(() => {
    const gf = groundGroupRef.current;
    const f1 = floor1GroupRef.current;
    const f2 = floor2GroupRef.current;
    const rf = roofGroupRef.current;

    if (!gf || !f1 || !f2 || !rf) return;

    // Floor visibility
    if (activeFloor === 'all') {
      gf.visible = true;
      f1.visible = true;
      f2.visible = true;
      rf.visible = true;
    } else if (activeFloor === 'Ground Floor') {
      gf.visible = true;
      f1.visible = false;
      f2.visible = false;
      rf.visible = false;
    } else if (activeFloor === '1st Floor') {
      gf.visible = false;
      f1.visible = true;
      f2.visible = false;
      rf.visible = false;
    } else if (activeFloor === '2nd Floor') {
      gf.visible = false;
      f1.visible = false;
      f2.visible = true;
      rf.visible = false;
    } else if (activeFloor === '3rd Floor') {
      gf.visible = false;
      f1.visible = false;
      f2.visible = true;
      rf.visible = true;
    }

    // Exploded View Y Offsets
    const separation = localExploded * 16; // 0 to 16 ft vertical shift
    gf.position.y = 0;
    f1.position.y = separation * 1;
    f2.position.y = separation * 2;
    rf.position.y = separation * 2.8;
  }, [activeFloor, localExploded]);

  const toggleNight = () => {
    const next = !isNight;
    setIsNight(next);
    if (onToggleNightMode) onToggleNightMode(next);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      id="interactive_3d_house_viewport"
      className={`relative w-full h-full min-h-[480px] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl select-none ${className}`}
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Top Floating Control Bar */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Floor Selection Pills */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-lg pointer-events-auto">
            <span className="text-[11px] font-semibold tracking-wider text-slate-400 px-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" /> FLOORS
            </span>
            {(['all', 'Ground Floor', '1st Floor', '2nd Floor'] as const).map((fl) => (
              <button
                key={fl}
                onClick={() => {
                  setActiveFloor(fl);
                  if (onFloorSelect) onFloorSelect(fl);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                  activeFloor === fl
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {fl === 'all' ? 'ALL' : fl === 'Ground Floor' ? 'GROUND' : fl.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Quick Lighting & Visual Modes */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Cutaway / Interior Inspect */}
            <button
              onClick={() => setIsCutaway(!isCutaway)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shadow-md ${
                isCutaway
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-amber-500/20'
                  : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
              title="Toggle Interior Cutaway / Transparent Exterior"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>CUTAWAY</span>
            </button>

            {/* Day / Night Mode */}
            <button
              onClick={toggleNight}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all shadow-md ${
                isNight
                  ? 'bg-indigo-900/60 border-indigo-400 text-indigo-200'
                  : 'bg-amber-500/20 border-amber-400 text-amber-200'
              }`}
              title="Toggle Day / Night Lighting"
            >
              {isNight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>NIGHT</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>DAY</span>
                </>
              )}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-md"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Bottom Camera Angle Presets & Zoom Tool HUD */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          {/* Camera View Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-xl pointer-events-auto">
            {(
              [
                { key: 'front', label: 'FRONT' },
                { key: 'back', label: 'BACK' },
                { key: 'left', label: 'LEFT' },
                { key: 'right', label: 'RIGHT' },
                { key: 'top', label: 'TOP' },
                { key: 'iso', label: 'ISO' },
                { key: 'reset', label: 'RESET' },
              ] as const
            ).map((v) => (
              <button
                key={v.key}
                onClick={() => setViewPreset(v.key)}
                className="px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Exploded View Slider & Zoom */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Exploded Floor Slider */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/60 text-slate-300 text-xs shadow-xl">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-medium text-slate-400">EXPLODE:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={localExploded}
                onChange={(e) => setLocalExploded(parseFloat(e.target.value))}
                className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-[10px] text-cyan-300 font-mono w-6">
                {Math.round(localExploded * 100)}%
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center p-1 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/60 shadow-xl">
              <button
                onClick={() => handleZoom(-5)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(5)}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewPreset('reset')}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset Camera"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Instructions Prompt */}
      <div className="absolute bottom-16 left-4 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] text-slate-400 border border-white/5">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span>Drag to rotate • Scroll to zoom • Right-click to pan</span>
      </div>
    </div>
  );
};
