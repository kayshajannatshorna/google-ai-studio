export type RoomCategory =
  | 'living_room'
  | 'bathroom'
  | 'dining_room'
  | 'bedroom'
  | 'master_bedroom'
  | 'kitchen'
  | 'drawing_room'
  | 'guest_room'
  | 'study_room'
  | 'family_room'
  | 'balcony'
  | 'staircase'
  | 'parking';

export type FloorLevel = 'Ground Floor' | '1st Floor' | '2nd Floor' | '3rd Floor';

export type FloorOption =
  | 'Single Floor (Ground Only)'
  | 'Ground + 1'
  | 'Ground + 2'
  | 'Ground + 3';

export type ObjectType =
  | 'sofa'
  | 'armchair'
  | 'center_table'
  | 'side_table'
  | 'dining_table'
  | 'dining_chair'
  | 'tv_unit'
  | 'tv'
  | 'bed'
  | 'nightstand'
  | 'wardrobe'
  | 'dressing_table'
  | 'mirror'
  | 'toilet'
  | 'wash_basin'
  | 'shower'
  | 'bathtub'
  | 'refrigerator'
  | 'kitchen_sink'
  | 'stove_oven'
  | 'kitchen_island'
  | 'kitchen_counter'
  | 'desk'
  | 'office_chair'
  | 'bookshelf'
  | 'rug'
  | 'plant'
  | 'pendant_light'
  | 'floor_lamp'
  | 'door'
  | 'window'
  | 'wall_art'
  | 'stairs';

export interface FurnitureObject {
  id: string;
  name: string;
  type: ObjectType;
  x: number; // in feet (room relative 0 to length)
  y: number; // in feet (room relative 0 to width)
  z?: number; // elevation from floor in feet
  width: number; // in feet (X dimension)
  depth: number; // in feet (Y dimension)
  height: number; // in feet (Z dimension)
  rotation: number; // degrees 0-360
  color?: string;
  material?: string;
  icon?: string;
  selected?: boolean;
}

export type FloorMaterial =
  | 'Hardwood Oak'
  | 'Dark Walnut'
  | 'Italian White Marble'
  | 'Black Slate'
  | 'Terrazzo Stone'
  | 'Polished Concrete'
  | 'Warm Beige Ceramic'
  | 'Herringbone Parquet';

export interface RoomDesign {
  id: string;
  category: RoomCategory;
  name: string;
  style: string;
  length: number; // ft
  width: number; // ft
  height: number; // ft
  area: number; // sq ft
  wallColor: string;
  floorMaterial: FloorMaterial;
  ceilingColor: string;
  lightingMood: 'warm' | 'neutral' | 'cool' | 'moody';
  description: string;
  features: string[];
  objects: FurnitureObject[];
  tags: string[];
}

export interface ConfiguredRoom {
  id: string;
  name: string;
  category: RoomCategory;
  floor: FloorLevel;
  length: number;
  width: number;
  area: number;
  designId: string;
  customDesign?: RoomDesign;
  positionX?: number; // position on floor plan
  positionY?: number;
}

export interface Setbacks {
  front: number; // ft
  rear: number;
  left: number;
  right: number;
}

export interface LandInput {
  length: number;
  width: number;
  unit: 'ft' | 'm';
  configuredMinRoomLength: number; // default 30
  configuredMinRoomWidth: number; // default 20
}

export interface LandAnalysis {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  buildableAreaSqFt: number;
  openSpaceSqFt: number;
  groundCoveragePercent: number;
  far: number; // Floor Area Ratio
  setbacks: Setbacks;
  suggestedFloorsCount: number;
  suggestedFloorsList: FloorLevel[];
  suggestedRoomCount: number;
  suggestedDistribution: {
    floor: FloorLevel;
    rooms: { category: RoomCategory; name: string; count: number; area: number }[];
    totalFloorArea: number;
  }[];
  estimatedCostRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface ExteriorOptions {
  wallColor: string;
  wallTexture: 'smooth' | 'brick' | 'timber_slat' | 'concrete';
  roofStyle: 'modern_flat' | 'slanted_pitch' | 'cantilever_terrace';
  roofColor: string;
  windowTint: 'clear' | 'smoke' | 'bronze';
  balconyGlass: boolean;
  gateStyle: 'modern_slat' | 'geometric_steel' | 'timber_iron';
  nightLighting: boolean;
  hasPool: boolean;
  hasGarden: boolean;
  hasCar: boolean;
  louverAccents: boolean;
}

export interface ProjectData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  land: LandInput;
  analysis: LandAnalysis;
  selectedFloorOption: string;
  floorsCount: number;
  rooms: ConfiguredRoom[];
  exterior: ExteriorOptions;
  notes?: string;
  status: 'draft' | 'configured' | 'finalized';
}

export type ViewTab =
  | 'home'
  | 'land'
  | 'floors'
  | 'rooms'
  | 'library'
  | 'customize'
  | 'complete_house'
  | 'blueprint2d'
  | 'projects';
