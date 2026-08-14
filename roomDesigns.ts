import { RoomCategory, RoomDesign, FurnitureObject, FloorMaterial } from '../types';

// Helper to create furniture objects cleanly
const createObj = (
  id: string,
  name: string,
  type: FurnitureObject['type'],
  x: number,
  y: number,
  width: number,
  depth: number,
  height: number,
  rotation = 0,
  color = '#8E8E93',
  material = 'Fabric'
): FurnitureObject => ({
  id,
  name,
  type,
  x,
  y,
  z: 0,
  width,
  depth,
  height,
  rotation,
  color,
  material,
});

// Category 1: LIVING ROOM (10 Designs)
export const livingRoomDesigns: RoomDesign[] = [
  {
    id: 'lr_01',
    category: 'living_room',
    name: 'Living Room Design 01 — Modern Minimalist Luxe',
    style: 'Modern Minimalist',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#F4F4F6',
    floorMaterial: 'Italian White Marble',
    ceilingColor: '#FFFFFF',
    lightingMood: 'warm',
    description: 'Crisp open-concept layout featuring a 4-seater modular sectional, low-profile center table, and media feature wall.',
    features: ['Floating Media Console', 'Architectural Recessed Lighting', 'Floor-to-Ceiling Windows', 'Silk Wool Area Rug'],
    tags: ['Minimalist', 'Marble', 'Spacious'],
    objects: [
      createObj('lr1_sofa', 'Modular 4-Seat Sectional', 'sofa', 6, 8, 12, 5, 2.8, 0, '#3A3D40', 'Boucle Fabric'),
      createObj('lr1_chair1', 'Lounge Accent Chair', 'armchair', 20, 7, 3.5, 3.5, 2.6, -45, '#C5A880', 'Cognac Leather'),
      createObj('lr1_chair2', 'Lounge Accent Chair 2', 'armchair', 20, 12, 3.5, 3.5, 2.6, -135, '#C5A880', 'Cognac Leather'),
      createObj('lr1_table', 'Marble & Oak Center Table', 'center_table', 11, 10, 6, 3.5, 1.4, 0, '#E5E0D8', 'Calacatta Marble'),
      createObj('lr1_rug', 'Geometric Area Rug', 'rug', 5, 6, 18, 11, 0.1, 0, '#D1CCC0', 'Wool Silk Blend'),
      createObj('lr1_tvunit', 'Floating Wall TV Console', 'tv_unit', 5, 18.5, 16, 1.5, 1.8, 0, '#2C2D30', 'Fluted Walnut'),
      createObj('lr1_tv', '85" 4K OLED TV Display', 'tv', 8.5, 19.2, 7, 0.4, 4, 0, '#111111', 'Glass & Metal'),
      createObj('lr1_plant', 'Fiddle Leaf Fig Planter', 'plant', 26, 17, 2.5, 2.5, 6, 0, '#2E7D32', 'Ceramic Pot'),
      createObj('lr1_lamp', 'Arched Brushed Brass Floor Lamp', 'floor_lamp', 3, 4, 2, 2, 7.5, 0, '#D4AF37', 'Brass'),
      createObj('lr1_door', 'Double Entry Door', 'door', 1, 10, 4, 0.5, 8, 90, '#5C4033', 'Solid Oak'),
      createObj('lr1_win1', 'Panoramic Window Bay', 'window', 10, 0.3, 12, 0.5, 7, 0, '#87CEEB', 'Clear Low-E Glass'),
    ],
  },
  {
    id: 'lr_02',
    category: 'living_room',
    name: 'Living Room Design 02 — Scandinavian Warm Hearth',
    style: 'Scandinavian',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#F9F8F6',
    floorMaterial: 'Hardwood Oak',
    ceilingColor: '#FFFFFF',
    lightingMood: 'warm',
    description: 'Cozy Nordic layout with ash wood accents, dual love seats, ceramic hearth corner, and textured boucle textiles.',
    features: ['Natural Oak Slat Wall', 'Double Love-Seat Configuration', 'Fireside Reading Nook'],
    tags: ['Cozy', 'Wood', 'Scandinavian'],
    objects: [
      createObj('lr2_sofa1', 'Nordic Cream 3-Seater', 'sofa', 7, 6, 9, 3.8, 2.7, 0, '#EAE6DF', 'Linen Wool'),
      createObj('lr2_sofa2', 'Matching 2-Seater Sofa', 'sofa', 18, 9, 7, 3.8, 2.7, -90, '#EAE6DF', 'Linen Wool'),
      createObj('lr2_table', 'Round Solid Oak Coffee Table', 'center_table', 9, 10, 4.5, 4.5, 1.5, 0, '#D2B48C', 'White Oak'),
      createObj('lr2_rug', 'Chunky Knitted Cream Rug', 'rug', 6, 5, 16, 12, 0.1, 0, '#F0EDE6', 'Organic Wool'),
      createObj('lr2_tvunit', 'Low Oak Sideboard & Media', 'tv_unit', 6, 18.5, 14, 1.8, 2, 0, '#C8AD7F', 'Natural Oak'),
      createObj('lr2_tv', '75" Frame TV', 'tv', 9.5, 19.1, 5.5, 0.3, 3.2, 0, '#1A1A1A', 'Matte Black'),
      createObj('lr2_plant', 'Monstera in Terracotta', 'plant', 26, 4, 2.8, 2.8, 5, 0, '#388E3C', 'Clay Pot'),
      createObj('lr2_lamp', 'Tripod Timber Floor Lamp', 'floor_lamp', 4, 4, 2.2, 2.2, 6, 0, '#BCAAA4', 'Fabric & Oak'),
      createObj('lr2_door', 'Oak Sliding Pocket Door', 'door', 1, 12, 4, 0.5, 8, 90, '#C8AD7F', 'Oak Veneer'),
      createObj('lr2_win', 'Triple Panel Window', 'window', 10, 0.3, 14, 0.5, 7, 0, '#A0C4DF', 'Double Glazed Glass'),
    ],
  },
  {
    id: 'lr_03',
    category: 'living_room',
    name: 'Living Room Design 03 — Japandi Zen Sanctuary',
    style: 'Japandi',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#EFECE6',
    floorMaterial: 'Warm Beige Ceramic',
    ceilingColor: '#F5F5F0',
    lightingMood: 'neutral',
    description: 'Low-slung minimalist seating with shoji screen aesthetics, tatami mat accents, and tranquil bonsai displays.',
    features: ['Low-Profile Platform Seating', 'Shoji Accents', 'Wabi-Sabi Stoneware', 'Acoustic Slatting'],
    tags: ['Zen', 'Earthy', 'Calm'],
    objects: [
      createObj('lr3_sofa', 'Low-Profile Platform Sofa', 'sofa', 7, 7, 11, 4.5, 2.2, 0, '#7D776E', 'Raw Linen'),
      createObj('lr3_chair', 'Rattan Lounge Chair', 'armchair', 21, 10, 3.2, 3.2, 2.4, -90, '#C2A676', 'Natural Rattan'),
      createObj('lr3_table', 'Solid Hinoki Wood Table', 'center_table', 10, 11, 6, 3, 1.1, 0, '#D7C4A5', 'Hinoki Cypress'),
      createObj('lr3_rug', 'Woven Jute & Hemp Floor Mat', 'rug', 6, 6, 17, 12, 0.1, 0, '#C4B59D', 'Woven Jute'),
      createObj('lr3_tvunit', 'Floating Cedar Slat Credenza', 'tv_unit', 6, 18.6, 15, 1.6, 1.4, 0, '#8C7355', 'Cedar Wood'),
      createObj('lr3_tv', '77" OLED Minimalist Screen', 'tv', 9.5, 19.1, 6.2, 0.3, 3.5, 0, '#222222', 'Carbon Fiber'),
      createObj('lr3_plant', 'Bonsai Pine on Stone Pedestal', 'plant', 25, 17, 2, 2, 4.5, 0, '#2E7D32', 'Granite Pedestal'),
      createObj('lr3_lamp', 'Washi Paper Pendant Lamp', 'pendant_light', 13, 12, 2.5, 2.5, 3, 0, '#FFF9C4', 'Washi Paper'),
      createObj('lr3_door', 'Shoji Sliding Screen Door', 'door', 1, 10, 4.5, 0.4, 8, 90, '#8C7355', 'Timber Lattice'),
      createObj('lr3_win', 'Large Garden View Glass', 'window', 8, 0.3, 16, 0.5, 7.5, 0, '#90CAF9', 'Low-Iron Glass'),
    ],
  },
  {
    id: 'lr_04',
    category: 'living_room',
    name: 'Living Room Design 04 — Modern Industrial Loft',
    style: 'Industrial Loft',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#D3D3D3',
    floorMaterial: 'Polished Concrete',
    ceilingColor: '#2B2B2B',
    lightingMood: 'moody',
    description: 'Distressed leather Chesterfield sofa, matte black steel track lighting, exposed brick feature wall, and reclaimed wood table.',
    features: ['Distressed Leather', 'Steel Track Spotlights', 'Exposed Conduit Aesthetic', 'Reclaimed Timber'],
    tags: ['Industrial', 'Leather', 'Steel'],
    objects: [
      createObj('lr4_sofa', 'Distressed Saddle Leather Sofa', 'sofa', 7, 7, 10, 4.2, 2.9, 0, '#8D5B32', 'Vintage Leather'),
      createObj('lr4_chair', 'Industrial Steel Frame Chair', 'armchair', 20, 8, 3.5, 3.2, 2.8, -45, '#37474F', 'Charcoal Canvas'),
      createObj('lr4_table', 'Reclaimed Factory Cart Table', 'center_table', 9, 10, 5.5, 3.5, 1.6, 0, '#5D4037', 'Reclaimed Pine & Iron'),
      createObj('lr4_rug', 'Overdyed Vintage Charcoal Rug', 'rug', 6, 5, 16, 12, 0.1, 0, '#424242', 'Distressed Wool'),
      createObj('lr4_tvunit', 'Steel Frame & Mesh Credenza', 'tv_unit', 6, 18.5, 14, 1.8, 2.2, 0, '#263238', 'Cast Iron & Steel'),
      createObj('lr4_tv', '85" Commercial Ultra-HD Display', 'tv', 9, 19.1, 7.2, 0.4, 4.1, 0, '#101010', 'Steel Bezel'),
      createObj('lr4_plant', 'Snake Plant in Iron Planter', 'plant', 26, 17, 2.2, 2.2, 5.5, 0, '#1B5E20', 'Cast Iron Pot'),
      createObj('lr4_lamp', 'Studio Tripod Spotlight Lamp', 'floor_lamp', 3, 3, 2.5, 2.5, 7, 0, '#212121', 'Matte Metal'),
      createObj('lr4_door', 'Industrial Steel & Glass Pivot Door', 'door', 1, 10, 4, 0.5, 8, 90, '#212121', 'Fluted Glass & Steel'),
      createObj('lr4_win', 'Black Mullion Grid Windows', 'window', 8, 0.3, 15, 0.5, 7.5, 0, '#78909C', 'Steel Crittall Window'),
    ],
  },
  {
    id: 'lr_05',
    category: 'living_room',
    name: 'Living Room Design 05 — Contemporary Villa Grand',
    style: 'Contemporary Villa',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#FAFAF9',
    floorMaterial: 'Italian White Marble',
    ceilingColor: '#FFFFFF',
    lightingMood: 'warm',
    description: 'Double conversational seating zone with dual U-shaped sofas, integrated marble cocktail bar, and chandelier.',
    features: ['Double Conversation Zones', 'Symmetrical Layout', 'Crystal Statement Chandelier', 'Brass Inlay Marble'],
    tags: ['Luxury', 'Villa', 'Chandelier'],
    objects: [
      createObj('lr5_sofa1', 'Curved Velvet 3-Seater Sofa', 'sofa', 5, 8, 9, 4, 2.8, 0, '#2B4162', 'Navy Velvet'),
      createObj('lr5_sofa2', 'Facing Curved Velvet Sofa', 'sofa', 16, 8, 9, 4, 2.8, 180, '#2B4162', 'Navy Velvet'),
      createObj('lr5_table', 'Brass Inlay Marble Double Table', 'center_table', 12, 10, 6, 4, 1.5, 0, '#E0E0E0', 'Carrara Marble'),
      createObj('lr5_rug', 'Hand-Tufted Silk Wool Carpet', 'rug', 4, 5, 22, 12, 0.1, 0, '#D8D4CD', 'Mulberry Silk'),
      createObj('lr5_tvunit', 'Fluted Marble & Gold Console', 'tv_unit', 7, 18.5, 16, 1.8, 2, 0, '#4A4036', 'Walnut & Brass'),
      createObj('lr5_tv', '98" Wall Inset Cinema Display', 'tv', 10, 19.2, 8, 0.4, 4.5, 0, '#000000', 'Frameless Glass'),
      createObj('lr5_plant', 'Bird of Paradise Tropical Plant', 'plant', 26, 4, 3, 3, 7, 0, '#1B5E20', 'Gold Leaf Pot'),
      createObj('lr5_lamp', 'Modern Crystal Ring Chandelier', 'pendant_light', 15, 10, 4, 4, 4, 0, '#FFD700', 'Crystal Glass'),
      createObj('lr5_door', 'Double Grand Arch Door', 'door', 1, 10, 5, 0.6, 9, 90, '#3E2723', 'Mahogany'),
      createObj('lr5_win', 'Curved Glass Corner Window', 'window', 10, 0.3, 16, 0.5, 8, 0, '#81D4FA', 'Tinted Solar Glass'),
    ],
  },
  {
    id: 'lr_06',
    category: 'living_room',
    name: 'Living Room Design 06 — Warm Bohemian Chic',
    style: 'Bohemian Chic',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#FDFBF7',
    floorMaterial: 'Hardwood Oak',
    ceilingColor: '#FFFDF9',
    lightingMood: 'warm',
    description: 'Layered rugs, curved mustard and terracotta seating, hanging wicker basket chairs, and lush vertical plant wall.',
    features: ['Layered Persian & Jute Rugs', 'Terracotta & Ochre Palette', 'Botanical Green Wall'],
    tags: ['Boho', 'Warm', 'Vibrant'],
    objects: [
      createObj('lr6_sofa', 'Mustard Velvet 4-Seater', 'sofa', 7, 7, 10.5, 4.2, 2.7, 0, '#D4A373', 'Ochre Velvet'),
      createObj('lr6_chair', 'Hanging Rattan Swing Chair', 'armchair', 22, 6, 3.5, 3.5, 5, 0, '#A68A68', 'Natural Wicker'),
      createObj('lr6_table', 'Hammered Brass Drum Table', 'center_table', 10, 10, 4.5, 4.5, 1.4, 0, '#B08968', 'Hammered Brass'),
      createObj('lr6_rug', 'Moroccan Tribal Pattern Rug', 'rug', 5, 5, 18, 12, 0.1, 0, '#E6CCB2', 'Organic Wool'),
      createObj('lr6_tvunit', 'Carved Teakwood Sideboard', 'tv_unit', 7, 18.5, 13, 1.8, 2.2, 0, '#7F5539', 'Solid Teak'),
      createObj('lr6_tv', '75" Ultra-Slim Smart TV', 'tv', 10, 19.1, 5.5, 0.3, 3.2, 0, '#1C1917', 'Slim Frame'),
      createObj('lr6_plant', 'Potted Rubber Tree & Ivy', 'plant', 26, 17, 3, 3, 6, 0, '#2D6A4F', 'Handmade Pottery'),
      createObj('lr6_lamp', 'Bamboo Woven Floor Lamp', 'floor_lamp', 3, 4, 2.2, 2.2, 6.5, 0, '#DDB892', 'Woven Bamboo'),
      createObj('lr6_door', 'Arched French Double Door', 'door', 1, 10, 4, 0.5, 8, 90, '#7F5539', 'Teak Wood'),
      createObj('lr6_win', 'Bay Window with Garden View', 'window', 9, 0.3, 14, 0.5, 7, 0, '#B7E4C7', 'Clear Glass'),
    ],
  },
  {
    id: 'lr_07',
    category: 'living_room',
    name: 'Living Room Design 07 — Mid-Century Modern Classic',
    style: 'Mid-Century Modern',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#F5F3EF',
    floorMaterial: 'Dark Walnut',
    ceilingColor: '#FFFFFF',
    lightingMood: 'warm',
    description: 'Iconic Eames lounge chair, walnut tapered-leg sofa, sputnik brass chandelier, and geometric teal accents.',
    features: ['Eames Lounge Chair & Ottoman', 'Tapered Walnut Legs', 'Sputnik Brass Chandelier'],
    tags: ['Mid-Century', 'Walnut', 'Iconic'],
    objects: [
      createObj('lr7_sofa', 'Tailored Tweed 3-Seater Sofa', 'sofa', 7, 7, 9.5, 3.8, 2.8, 0, '#005F73', 'Teal Tweed'),
      createObj('lr7_eames', 'Walnut & Black Leather Lounge', 'armchair', 20, 8, 4, 4, 3, -45, '#1A1A1D', 'Aniline Leather'),
      createObj('lr7_table', 'Noguchi Style Glass Coffee Table', 'center_table', 9, 10, 5, 3.5, 1.3, 0, '#94D2BD', 'Tempered Glass & Walnut'),
      createObj('lr7_rug', 'Abstract Geometric Diamond Rug', 'rug', 6, 5, 16, 12, 0.1, 0, '#E9D8A6', 'Wool Blend'),
      createObj('lr7_tvunit', 'Danish Walnut Slat Credenza', 'tv_unit', 6, 18.5, 14, 1.8, 2.2, 0, '#583101', 'American Walnut'),
      createObj('lr7_tv', '80" 4K Smart TV', 'tv', 9.5, 19.1, 6, 0.3, 3.5, 0, '#111111', 'Metallic Bezel'),
      createObj('lr7_plant', 'Snake Plant in Mid-Century Stand', 'plant', 26, 17, 2, 2, 4.5, 0, '#0A9396', 'Walnut Stand Pot'),
      createObj('lr7_lamp', 'Sputnik 12-Light Brass Chandelier', 'pendant_light', 14, 10, 3.5, 3.5, 3, 0, '#EE9B00', 'Brushed Brass'),
      createObj('lr7_door', 'Walnut Fluted Door', 'door', 1, 10, 4, 0.5, 8, 90, '#583101', 'Walnut Timber'),
      createObj('lr7_win', 'Horizontal Strip Ribbon Windows', 'window', 8, 0.3, 16, 0.5, 6.5, 0, '#83C5BE', 'Clear Glazing'),
    ],
  },
  {
    id: 'lr_08',
    category: 'living_room',
    name: 'Living Room Design 08 — Coastal Breeze Solarium',
    style: 'Coastal Modern',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#F0F8FF',
    floorMaterial: 'Herringbone Parquet',
    ceilingColor: '#FFFFFF',
    lightingMood: 'cool',
    description: 'Breezy coastal aesthetic with crisp white linen slipcovers, light weathered wood, and seamless glass patio sliders.',
    features: ['White Linen Slipcovers', 'Full Glass Patio Sliders', 'Driftwood Accent Tables'],
    tags: ['Coastal', 'Bright', 'Airy'],
    objects: [
      createObj('lr8_sofa', 'White Belgian Linen Sectional', 'sofa', 6, 7, 11, 4.5, 2.8, 0, '#F8F9FA', 'Belgian Linen'),
      createObj('lr8_chair', 'Striped Coastal Club Chair', 'armchair', 20, 8, 3.5, 3.5, 2.7, -45, '#4682B4', 'Navy Stripe Cotton'),
      createObj('lr8_table', 'Weathered Driftwood Center Table', 'center_table', 10, 10, 5.5, 3.5, 1.4, 0, '#D6CCC2', 'Weathered Teak'),
      createObj('lr8_rug', 'Bleached Jute & Cotton Weave Rug', 'rug', 5, 5, 17, 12, 0.1, 0, '#EDEDE9', 'Organic Jute'),
      createObj('lr8_tvunit', 'Whitewashed Oak Media Console', 'tv_unit', 7, 18.5, 13, 1.6, 2, 0, '#E3D5CA', 'Whitewash Oak'),
      createObj('lr8_tv', '75" Frame TV with White Bezel', 'tv', 10, 19.1, 5.5, 0.3, 3.2, 0, '#F0F0F0', 'Matte White Frame'),
      createObj('lr8_plant', 'Potted Areca Palm', 'plant', 26, 4, 3, 3, 6.5, 0, '#2D6A4F', 'Seagrass Basket'),
      createObj('lr8_lamp', 'Rope & Glass Lantern Chandelier', 'pendant_light', 14, 10, 3, 3, 3, 0, '#D4A373', 'Jute Rope & Glass'),
      createObj('lr8_door', 'Sliding Glass Terrace Door', 'door', 1, 10, 4.5, 0.4, 8, 90, '#FFFFFF', 'White Aluminium'),
      createObj('lr8_win', 'Full Wall Panoramic Glass Slider', 'window', 7, 0.3, 18, 0.5, 8, 0, '#BEE9E8', 'Low-E Acoustic Glass'),
    ],
  },
  {
    id: 'lr_09',
    category: 'living_room',
    name: 'Living Room Design 09 — High-Tech Smart Media Lounge',
    style: 'Futuristic High-Tech',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#1F242D',
    floorMaterial: 'Black Slate',
    ceilingColor: '#12141A',
    lightingMood: 'moody',
    description: 'Acoustically treated media lounge with RGB ambient backlights, motorized motorized leather recliners, and 120" laser projection screen.',
    features: ['120" Ambient Light Rejecting Screen', 'Integrated Dolby Atmos Surround', 'Motorized Leather Recliners', 'Smart Mood Illumination'],
    tags: ['High-Tech', 'Cinema', 'Smart'],
    objects: [
      createObj('lr9_sofa', '3-Seat Motorized Cinema Recliner', 'sofa', 6, 7, 10, 4.5, 3.2, 0, '#1B1E24', 'Premium Nappa Leather'),
      createObj('lr9_chair', 'Single Electric Lounger', 'armchair', 19, 8, 3.8, 3.8, 3.2, -45, '#1B1E24', 'Nappa Leather'),
      createObj('lr9_table', 'Smoked Glass & LED Bar Table', 'center_table', 10, 10, 5, 3, 1.5, 0, '#2D3748', 'Smoked Tempered Glass'),
      createObj('lr9_rug', 'Acoustic Sound-Damping Dark Carpet', 'rug', 5, 5, 18, 12, 0.1, 0, '#171923', 'High-Density Microfiber'),
      createObj('lr9_tvunit', 'Acoustic Audio Rack & Subwoofer Base', 'tv_unit', 5, 18.5, 16, 2, 2, 0, '#0F172A', 'Matte Carbon'),
      createObj('lr9_tv', '120" Ultra-Short-Throw Laser Screen', 'tv', 7, 19.2, 10, 0.2, 5.5, 0, '#020617', 'ALR Screen Material'),
      createObj('lr9_plant', 'Hydroponic Indoor LED Planter', 'plant', 26, 17, 2.5, 2.5, 5, 0, '#10B981', 'Anodized Steel Pot'),
      createObj('lr9_lamp', 'Recessed RGB Linear Smart Light Strips', 'floor_lamp', 3, 3, 1.5, 1.5, 7, 0, '#38BDF8', 'Smart LED Channel'),
      createObj('lr9_door', 'Acoustic Soundproof Heavy Door', 'door', 1, 10, 4, 0.6, 8, 90, '#1E293B', 'Acoustic Core'),
      createObj('lr9_win', 'Smart Electrochromic Privacy Window', 'window', 9, 0.3, 14, 0.5, 7, 0, '#334155', 'Smart PDLC Glass'),
    ],
  },
  {
    id: 'lr_10',
    category: 'living_room',
    name: 'Living Room Design 10 — Classical French Renaissance',
    style: 'Classical French',
    length: 30,
    width: 20,
    height: 10,
    area: 600,
    wallColor: '#F7F5F0',
    floorMaterial: 'Herringbone Parquet',
    ceilingColor: '#FFFFFF',
    lightingMood: 'warm',
    description: 'Elaborate wall boiserie mouldings, carved giltwood Bergère armchairs, Carrara marble mantle fireplace, and silk damask drapery.',
    features: ['Wall Boiserie Moulding Panels', 'Carved Giltwood Bergere Chairs', 'Classic Fireplace Mantle'],
    tags: ['Classical', 'Ornate', 'French'],
    objects: [
      createObj('lr10_sofa', 'Gilded French Cabriole 3-Seater', 'sofa', 7, 7, 9.5, 3.8, 3, 0, '#C4B59D', 'Silk Damask Upholstery'),
      createObj('lr10_chair1', 'Carved Bergere Armchair', 'armchair', 19, 7, 3.5, 3.5, 3.2, -45, '#D4AF37', 'Gold Leaf & Velvet'),
      createObj('lr10_chair2', 'Carved Bergere Armchair 2', 'armchair', 19, 12, 3.5, 3.5, 3.2, -135, '#D4AF37', 'Gold Leaf & Velvet'),
      createObj('lr10_table', 'Louis XV Carved Gilt Center Table', 'center_table', 9.5, 10, 5, 3.2, 1.6, 0, '#D4AF37', 'Gold Leaf & Onyx'),
      createObj('lr10_rug', 'Aubusson Medallion Wool Carpet', 'rug', 5, 5, 18, 12, 0.1, 0, '#D7C9B8', 'Hand-Knotted Wool'),
      createObj('lr10_tvunit', 'Classical Fireplace Mantle & Console', 'tv_unit', 7, 18.5, 13, 2, 3.5, 0, '#E5E0D8', 'Carved Carrara Stone'),
      createObj('lr10_tv', 'Frame TV with Ornate Gilded Border', 'tv', 9.5, 19.1, 5.5, 0.4, 3.2, 0, '#D4AF37', 'Antique Gold Frame'),
      createObj('lr10_plant', 'Urn Planter with Topiary', 'plant', 26, 4, 2.5, 2.5, 5.5, 0, '#2D6A4F', 'Cast Stone Classical Urn'),
      createObj('lr10_lamp', 'Baccarat Style Crystal Chandelier', 'pendant_light', 14, 10, 4, 4, 4.5, 0, '#FFD700', 'Hand-Cut Crystal'),
      createObj('lr10_door', 'Double Panel French Moulded Door', 'door', 1, 10, 4.5, 0.5, 8.5, 90, '#EDE8DF', 'Enamelled Wood'),
      createObj('lr10_win', 'Arched French Casement Window', 'window', 9, 0.3, 14, 0.5, 7.5, 0, '#A0C4DF', 'Beveled Glass'),
    ],
  },
];

// Helper to generate the remaining room categories with 10 detailed designs each
export const generateCategoryDesigns = (category: RoomCategory): RoomDesign[] => {
  if (category === 'living_room') return livingRoomDesigns;

  const categoryConfigs: Partial<Record<RoomCategory, {
    baseName: string;
    styles: string[];
    palettes: { wall: string; floor: FloorMaterial; mood: 'warm' | 'neutral' | 'cool' | 'moody' }[];
    itemSets: { name: string; type: FurnitureObject['type']; w: number; d: number; h: number; color: string; mat: string }[][];
  }>> = {
    bathroom: {
      baseName: 'Bathroom',
      styles: [
        'Spa Suite with Freestanding Tub', 'Minimalist Walk-In Glass', 'Calacatta Marble Luxury',
        'Japanese Onsen Zen', 'Matte Black Monochromatic', 'Terrazzo Vibrant Pop',
        'Double Vanity Hotel Deluxe', 'Compact Scandinavian Slate', 'Mediterranean Arch Sanctuary', 'High-Tech Smart Bath'
      ],
      palettes: [
        { wall: '#F8F9FA', floor: 'Italian White Marble', mood: 'warm' },
        { wall: '#FFFFFF', floor: 'Black Slate', mood: 'cool' },
        { wall: '#FAF8F5', floor: 'Italian White Marble', mood: 'warm' },
        { wall: '#EAE6E1', floor: 'Warm Beige Ceramic', mood: 'warm' },
        { wall: '#212529', floor: 'Black Slate', mood: 'moody' },
        { wall: '#F0EFEB', floor: 'Terrazzo Stone', mood: 'neutral' },
        { wall: '#F5F5F7', floor: 'Italian White Marble', mood: 'neutral' },
        { wall: '#E5E7EB', floor: 'Black Slate', mood: 'cool' },
        { wall: '#FDF6E2', floor: 'Terrazzo Stone', mood: 'warm' },
        { wall: '#0F172A', floor: 'Polished Concrete', mood: 'moody' }
      ],
      itemSets: [
        [
          { name: 'Freestanding Oval Bathtub', type: 'bathtub', w: 6, d: 3.5, h: 2.2, color: '#FFFFFF', mat: 'Acrylic Stone' },
          { name: 'Walk-in Rain Shower Glass', type: 'shower', w: 5, d: 5, h: 7.5, color: '#A0C4DF', mat: 'Tempered Glass' },
          { name: 'Floating Double Vanity', type: 'wash_basin', w: 8, d: 2, h: 2.8, color: '#D2B48C', mat: 'Natural Oak & Quartz' },
          { name: 'Wall-Hung Smart Toilet', type: 'toilet', w: 2, d: 2.8, h: 2.6, color: '#FFFFFF', mat: 'Ceramic' },
          { name: 'Backlit Anti-Fog Mirror', type: 'mirror', w: 7, d: 0.3, h: 3.5, color: '#E2E8F0', mat: 'LED Glass' },
          { name: 'Potted Bamboo Plant', type: 'plant', w: 2, d: 2, h: 4.5, color: '#16A34A', mat: 'Ceramic Pot' },
        ]
      ]
    },
    dining_room: {
      baseName: 'Dining Room',
      styles: [
        'Formal 8-Seater Grand Banquet', 'Open Island-Dining Concept', 'Modern Round Bistro Setting',
        'Scandinavian Oak Long Bench', 'Industrial Cast Iron & Pine', 'Minimalist Floating Glass',
        'Japanese Low Tatami Modern', 'Rustic Tuscan Farmhouse', 'Luxury Calacatta Chandelier', 'Sunroom Alfresco Dining'
      ],
      palettes: [
        { wall: '#FAF9F6', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#F3F4F6', floor: 'Italian White Marble', mood: 'neutral' },
        { wall: '#FDF8F0', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#FFFFFF', floor: 'Hardwood Oak', mood: 'neutral' },
        { wall: '#D1D5DB', floor: 'Polished Concrete', mood: 'moody' },
        { wall: '#F8FAFC', floor: 'Italian White Marble', mood: 'cool' },
        { wall: '#E7E5E4', floor: 'Warm Beige Ceramic', mood: 'warm' },
        { wall: '#FEF3C7', floor: 'Herringbone Parquet', mood: 'warm' },
        { wall: '#F8F9FA', floor: 'Italian White Marble', mood: 'warm' },
        { wall: '#F0FDF4', floor: 'Terrazzo Stone', mood: 'cool' }
      ],
      itemSets: [
        [
          { name: '8-Person Solid Wood Table', type: 'dining_table', w: 9, d: 4.2, h: 2.6, color: '#4A3B32', mat: 'Walnut Wood' },
          { name: 'Modern Upholstered Chairs (Set)', type: 'dining_chair', w: 10, d: 6, h: 3, color: '#C5A880', mat: 'Boucle Fabric' },
          { name: 'Linear Brass Pendant Light', type: 'pendant_light', w: 6, d: 1.5, h: 3.5, color: '#D4AF37', mat: 'Brushed Brass' },
          { name: 'Storage Buffet & Wine Credenza', type: 'bookshelf', w: 10, d: 1.8, h: 3, color: '#2C2D30', mat: 'Fluted Timber' },
          { name: 'Large Abstract Wall Art', type: 'wall_art', w: 8, d: 0.2, h: 4, color: '#3B82F6', mat: 'Canvas' },
          { name: 'Wool Woven Dining Rug', type: 'rug', w: 14, d: 9, h: 0.1, color: '#E2E8F0', mat: 'Flatweave Wool' },
        ]
      ]
    },
    bedroom: {
      baseName: 'Bedroom',
      styles: [
        'Cozy Scandinavian Minimalist', 'Japandi Platform Retreat', 'Urban Contemporary Lounge',
        'Luxury Velvet Boutique Hotel', 'Minimalist Floating Bed Suite', 'Coastal Linen Oceanview',
        'Executive Walnut Sanctuary', 'Industrial Brick Accent Bedroom', 'Warm Bohemian Canopy', 'Modern High-Tech Smart Suite'
      ],
      palettes: [
        { wall: '#F7F6F2', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#EFECE6', floor: 'Warm Beige Ceramic', mood: 'warm' },
        { wall: '#F3F4F6', floor: 'Dark Walnut', mood: 'neutral' },
        { wall: '#1E293B', floor: 'Herringbone Parquet', mood: 'moody' },
        { wall: '#FFFFFF', floor: 'Italian White Marble', mood: 'cool' },
        { wall: '#F0F9FF', floor: 'Herringbone Parquet', mood: 'cool' },
        { wall: '#FDFBF7', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#E5E7EB', floor: 'Polished Concrete', mood: 'moody' },
        { wall: '#FFFBEB', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#0F172A', floor: 'Black Slate', mood: 'moody' }
      ],
      itemSets: [
        [
          { name: 'King Platform Bed with Tufted Headboard', type: 'bed', w: 7, d: 7.5, h: 3.8, color: '#475569', mat: 'Velvet Fabric' },
          { name: 'Matching Nightstands (Pair)', type: 'nightstand', w: 11, d: 1.8, h: 2, color: '#94A3B8', mat: 'Oak & Brass' },
          { name: 'Built-in 4-Door Wardrobe', type: 'wardrobe', w: 10, d: 2.2, h: 8, color: '#334155', mat: 'Fluted Lacquer' },
          { name: 'Dressing Table & Mirror Nook', type: 'dressing_table', w: 5, d: 1.8, h: 4.5, color: '#CBD5E1', mat: 'Quartz & Metal' },
          { name: 'Wall-Mounted 65" TV Display', type: 'tv', w: 5, d: 0.3, h: 2.8, color: '#0F172A', mat: 'OLED Glass' },
          { name: 'Lounge Accent Armchair', type: 'armchair', w: 3.5, d: 3.5, h: 2.8, color: '#D97706', mat: 'Leather' },
          { name: 'Plush High-Pile Bedside Rug', type: 'rug', w: 12, d: 10, h: 0.1, color: '#E2E8F0', mat: 'Shag Wool' },
        ]
      ]
    },
    master_bedroom: {
      baseName: 'Master Bedroom',
      styles: [
        'Presidential Suite with Walk-In & Bath', 'Penthouse Panorama Lounge', 'Zen Master Sanctuary',
        'Architectural Cantilever Suite', 'Royal Classical Suite', 'Duplex Loft Master',
        'Terrace-Connected Sanctuary', 'Minimalist Monolith Suite', 'Luxury Boutique Hotel Master', 'Smart Biophilic Master Suite'
      ],
      palettes: [
        { wall: '#F8F7F4', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#F1F5F9', floor: 'Italian White Marble', mood: 'cool' },
        { wall: '#EDE8DF', floor: 'Warm Beige Ceramic', mood: 'warm' },
        { wall: '#FDFBF7', floor: 'Herringbone Parquet', mood: 'warm' },
        { wall: '#FAF5EF', floor: 'Herringbone Parquet', mood: 'warm' },
        { wall: '#E2E8F0', floor: 'Hardwood Oak', mood: 'neutral' },
        { wall: '#ECFDF5', floor: 'Italian White Marble', mood: 'cool' },
        { wall: '#FFFFFF', floor: 'Black Slate', mood: 'moody' },
        { wall: '#334155', floor: 'Dark Walnut', mood: 'moody' },
        { wall: '#F8FAFC', floor: 'Hardwood Oak', mood: 'neutral' }
      ],
      itemSets: [
        [
          { name: 'Emperor Luxury Bed with Acoustic Wall', type: 'bed', w: 8, d: 8, h: 4.5, color: '#1E293B', mat: 'Italian Leather & Walnut' },
          { name: 'Cantilevered Marble Nightstands', type: 'nightstand', w: 12, d: 2, h: 1.8, color: '#E2E8F0', mat: 'Calacatta & Brass' },
          { name: 'Walk-In Glass Wardrobe System', type: 'wardrobe', w: 12, d: 3, h: 8.5, color: '#0F172A', mat: 'Smoked Glass & LED' },
          { name: 'Master Lounge Loveseat & Ottoman', type: 'sofa', w: 7, d: 3.5, h: 2.8, color: '#D97706', mat: 'Cognac Leather' },
          { name: 'Floating Executive TV Console', type: 'tv_unit', w: 10, d: 1.6, h: 1.8, color: '#334155', mat: 'Fluted Walnut' },
          { name: '75" 4K Smart Master TV', type: 'tv', w: 6, d: 0.3, h: 3.5, color: '#000000', mat: 'Glass' },
          { name: 'Vanity Dressing Island with Mirror', type: 'dressing_table', w: 6, d: 2.5, h: 3.2, color: '#F1F5F9', mat: 'Marble Top' },
        ]
      ]
    },
    kitchen: {
      baseName: 'Kitchen',
      styles: [
        'Gourmet Chef Island Kitchen', 'L-Shaped Breakfast Bar', 'U-Shaped Ergonomic Kitchen',
        'Parallel Galley Modern', 'Straight Minimalist Kitchen', 'Open Living Bar Kitchen',
        'Luxury Italian Marble Kitchen', 'Scandinavian Two-Tone Oak', 'Industrial Stainless & Brick', 'Smart Compact Modular'
      ],
      palettes: [
        { wall: '#F8F9FA', floor: 'Italian White Marble', mood: 'neutral' },
        { wall: '#FFFFFF', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#F3F4F6', floor: 'Polished Concrete', mood: 'cool' },
        { wall: '#FAF8F5', floor: 'Warm Beige Ceramic', mood: 'warm' },
        { wall: '#E5E7EB', floor: 'Black Slate', mood: 'cool' },
        { wall: '#FDFBF7', floor: 'Herringbone Parquet', mood: 'warm' },
        { wall: '#FFFFFF', floor: 'Italian White Marble', mood: 'warm' },
        { wall: '#F9FAFB', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#374151', floor: 'Polished Concrete', mood: 'moody' },
        { wall: '#0F172A', floor: 'Terrazzo Stone', mood: 'moody' }
      ],
      itemSets: [
        [
          { name: 'Central Marble Kitchen Island with Bar Stools', type: 'kitchen_island', w: 10, d: 4.5, h: 3, color: '#E2E8F0', mat: 'Calacatta Quartz' },
          { name: 'Floor-to-Ceiling Wall Cabinet System', type: 'kitchen_counter', w: 14, d: 2.2, h: 8, color: '#1E293B', mat: 'Matte Charcoal & Oak' },
          { name: 'Commercial Induction Range & Hood', type: 'stove_oven', w: 4, d: 2.4, h: 3.2, color: '#475569', mat: 'Stainless Steel' },
          { name: 'Double Basin Undermount Sink', type: 'kitchen_sink', w: 3.5, d: 2.2, h: 3, color: '#94A3B8', mat: 'Brushed Gunmetal' },
          { name: 'French Door Integrated Refrigerator', type: 'refrigerator', w: 4, d: 2.8, h: 6.8, color: '#334155', mat: 'Stainless Steel' },
          { name: 'Pendant Island Lighting Trio', type: 'pendant_light', w: 8, d: 1, h: 3, color: '#D4AF37', mat: 'Brushed Brass' },
        ]
      ]
    },
    drawing_room: {
      baseName: 'Drawing Room',
      styles: [
        'Executive Reception Salon', 'Art Deco Luxury Majlis', 'Modern Formal Majlis',
        'Classical Crown Moulding Parlour', 'Double-Height Gallery Salon', 'Minimalist Architectural Lounge',
        'Fireside Cozy Library Parlour', 'Glass Pavilion Garden Drawing', 'Mid-Century Conversation Salon', 'Luxury Penthouse Formal Lounge'
      ],
      palettes: [
        { wall: '#FAF9F5', floor: 'Italian White Marble', mood: 'warm' },
        { wall: '#1A202C', floor: 'Herringbone Parquet', mood: 'moody' },
        { wall: '#FDFBF7', floor: 'Italian White Marble', mood: 'warm' },
        { wall: '#F5F5F0', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#FFFFFF', floor: 'Italian White Marble', mood: 'neutral' },
        { wall: '#E5E7EB', floor: 'Polished Concrete', mood: 'cool' },
        { wall: '#FEF3C7', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#F0F9FF', floor: 'Italian White Marble', mood: 'cool' },
        { wall: '#EDE8DF', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#0F172A', floor: 'Black Slate', mood: 'moody' }
      ],
      itemSets: [
        [
          { name: 'Formal Chesterfield 4-Seater Sofa', type: 'sofa', w: 10, d: 4, h: 2.9, color: '#1E3A8A', mat: 'Royal Blue Velvet' },
          { name: 'Formal Wingback Armchairs (Pair)', type: 'armchair', w: 9, d: 3.5, h: 3.4, color: '#B45309', mat: 'Italian Leather' },
          { name: 'Marble Inlay Coffee Table', type: 'center_table', w: 6, d: 3.5, h: 1.5, color: '#E2E8F0', mat: 'Carrara Marble & Brass' },
          { name: 'Display Credenza & Art Wall', type: 'bookshelf', w: 12, d: 1.8, h: 4, color: '#334155', mat: 'Walnut & Glass' },
          { name: 'Grand Crystal Chandelier', type: 'pendant_light', w: 5, d: 5, h: 4.5, color: '#FBBF24', mat: 'Crystal & Brass' },
          { name: 'Traditional Hand-Woven Silk Rug', type: 'rug', w: 16, d: 11, h: 0.1, color: '#CBD5E1', mat: 'Fine Wool Silk' },
        ]
      ]
    },
    guest_room: {
      baseName: 'Guest Room',
      styles: [
        'Multi-functional Studio Suite', 'Deluxe Hotel Twin Bed Suite', 'Warm Garden-Facing Guest Room',
        'Scandinavian Daybed Sanctuary', 'Murphy Bed & Study Combo', 'Cozy Attic Guest Nook',
        'Executive Guest with Workstation', 'Zen Minimalist Guest Retreat', 'Compact En-Suite Guest Bedroom', 'Contemporary Queen Suite'
      ],
      palettes: [
        { wall: '#F8FAFC', floor: 'Hardwood Oak', mood: 'neutral' },
        { wall: '#FDFBF7', floor: 'Herringbone Parquet', mood: 'warm' },
        { wall: '#F0FDF4', floor: 'Hardwood Oak', mood: 'cool' },
        { wall: '#FFFFFF', floor: 'Hardwood Oak', mood: 'neutral' },
        { wall: '#F1F5F9', floor: 'Warm Beige Ceramic', mood: 'neutral' },
        { wall: '#FFFBEB', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#F8F9FA', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#E7E5E4', floor: 'Warm Beige Ceramic', mood: 'warm' },
        { wall: '#F3F4F6', floor: 'Italian White Marble', mood: 'cool' },
        { wall: '#FAF5FF', floor: 'Herringbone Parquet', mood: 'warm' }
      ],
      itemSets: [
        [
          { name: 'Queen Upholstered Guest Bed', type: 'bed', w: 6.5, d: 7, h: 3.5, color: '#64748B', mat: 'Linen Weave' },
          { name: 'Dual Compact Nightstands', type: 'nightstand', w: 10, d: 1.6, h: 2, color: '#CBD5E1', mat: 'Natural Ash' },
          { name: 'Integrated Wardrobe & Luggage Bench', type: 'wardrobe', w: 8, d: 2, h: 7.5, color: '#334155', mat: 'Oak & Metal' },
          { name: 'Guest Writing Desk & Chair', type: 'desk', w: 4.5, d: 2, h: 2.6, color: '#94A3B8', mat: 'Oak & Steel' },
          { name: 'Wall Mounted 55" Guest TV', type: 'tv', w: 4.2, d: 0.3, h: 2.5, color: '#0F172A', mat: 'Smart LED' },
          { name: 'Cozy Accent Rug', type: 'rug', w: 10, d: 8, h: 0.1, color: '#E2E8F0', mat: 'Wool Blend' },
        ]
      ]
    },
    study_room: {
      baseName: 'Study / Home Office',
      styles: [
        'Executive Library & Mahogany Desk', 'Dual Workstation Tech Studio', 'Minimalist Floating Desk Office',
        'Window-Nook Creative Sanctuary', 'Architectural Drafting Studio', 'Corner Acoustic Pod Office',
        'Floor-to-Ceiling Bookshelf Study', 'Modern Industrial Creator Studio', 'Sunlit Garden Atelier', 'Smart Pod Video Conference Suite'
      ],
      palettes: [
        { wall: '#F7F5F0', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#0F172A', floor: 'Polished Concrete', mood: 'moody' },
        { wall: '#FFFFFF', floor: 'Hardwood Oak', mood: 'cool' },
        { wall: '#F0F9FF', floor: 'Hardwood Oak', mood: 'cool' },
        { wall: '#E5E7EB', floor: 'Polished Concrete', mood: 'neutral' },
        { wall: '#1E293B', floor: 'Herringbone Parquet', mood: 'moody' },
        { wall: '#FEF3C7', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#374151', floor: 'Polished Concrete', mood: 'moody' },
        { wall: '#F0FDF4', floor: 'Italian White Marble', mood: 'cool' },
        { wall: '#18181B', floor: 'Black Slate', mood: 'moody' }
      ],
      itemSets: [
        [
          { name: 'Executive Solid Oak Desk', type: 'desk', w: 7, d: 3.5, h: 2.5, color: '#451A03', mat: 'Solid Walnut' },
          { name: 'Ergonomic High-Back Leather Chair', type: 'office_chair', w: 2.5, d: 2.5, h: 4, color: '#1E293B', mat: 'Nappa Leather' },
          { name: 'Floor-to-Ceiling Library Bookshelves', type: 'bookshelf', w: 14, d: 1.5, h: 8.5, color: '#334155', mat: 'Walnut & Brass Ladder' },
          { name: 'Client Meeting Lounge Chairs (Pair)', type: 'armchair', w: 6, d: 3, h: 2.8, color: '#B45309', mat: 'Cognac Leather' },
          { name: 'Adjustable Architectural Task Lamp', type: 'floor_lamp', w: 2, d: 2, h: 5.5, color: '#D4AF37', mat: 'Brass & Steel' },
          { name: 'Low-Pile Acoustic Office Rug', type: 'rug', w: 12, d: 9, h: 0.1, color: '#CBD5E1', mat: 'Commercial Wool' },
        ]
      ]
    },
    family_room: {
      baseName: 'Family Lounge',
      styles: [
        'Home Cinema & Media Den', 'Kid-Friendly Play & Game Lounge', 'Split-Level Sunken Lounge',
        'Games & Billiards Lounge', 'Fireplace Hearth Family Hub', 'Terrace Skylight Family Room',
        'Casual Modular Sectional Hub', 'Library & Board Game Nook', 'Music & Acoustic Jam Lounge', 'Great Room Open Concept'
      ],
      palettes: [
        { wall: '#1E293B', floor: 'Dark Walnut', mood: 'moody' },
        { wall: '#FDFBF7', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#F8FAFC', floor: 'Polished Concrete', mood: 'neutral' },
        { wall: '#FAF5FF', floor: 'Herringbone Parquet', mood: 'warm' },
        { wall: '#FEF3C7', floor: 'Dark Walnut', mood: 'warm' },
        { wall: '#F0F9FF', floor: 'Italian White Marble', mood: 'cool' },
        { wall: '#F5F5F4', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#FDF8F6', floor: 'Hardwood Oak', mood: 'warm' },
        { wall: '#334155', floor: 'Polished Concrete', mood: 'moody' },
        { wall: '#FFFFFF', floor: 'Italian White Marble', mood: 'neutral' }
      ],
      itemSets: [
        [
          { name: 'Large Deep U-Sectional Family Sofa', type: 'sofa', w: 12, d: 8, h: 2.8, color: '#334155', mat: 'Stain-Resistant Performance Fabric' },
          { name: 'Storage Ottoman & Game Table', type: 'center_table', w: 5, d: 3.5, h: 1.5, color: '#A16207', mat: 'Padded Leather & Wood' },
          { name: 'Media & Game Console Wall Unit', type: 'tv_unit', w: 14, d: 1.8, h: 7, color: '#1E293B', mat: 'Lacquered Oak' },
          { name: '85" 4K HDR Family Entertainment Display', type: 'tv', w: 7, d: 0.4, h: 4, color: '#000000', mat: 'OLED Display' },
          { name: 'Beanbag & Floor Cushion Set', type: 'armchair', w: 6, d: 3, h: 2, color: '#EA580C', mat: 'Canvas' },
          { name: 'Ultra-Soft Family Shag Carpet', type: 'rug', w: 16, d: 12, h: 0.1, color: '#E2E8F0', mat: 'Plush Microfiber' },
        ]
      ]
    }
  };

  const config = categoryConfigs[category as Exclude<RoomCategory, 'living_room'>];
  if (!config) return [];

  return config.styles.map((style, idx) => {
    const pad = (idx + 1).toString().padStart(2, '0');
    const palette = config.palettes[idx] || config.palettes[0];
    const baseItems = config.itemSets[0] || [];

    // Position objects cleanly in room (length 30, width 20)
    const objects: FurnitureObject[] = [
      ...baseItems.map((item, itemIdx) => {
        const posX = 4 + (itemIdx % 3) * 7.5;
        const posY = 5 + Math.floor(itemIdx / 3) * 6;
        return createObj(
          `${category}_${pad}_obj_${itemIdx + 1}`,
          item.name,
          item.type,
          posX,
          posY,
          item.w,
          item.d,
          item.h,
          0,
          item.color,
          item.mat
        );
      }),
      createObj(`${category}_${pad}_door`, 'Entry Door', 'door', 1, 10, 4, 0.5, 8, 90, '#5C4033', 'Wood'),
      createObj(`${category}_${pad}_win`, 'Casement Window', 'window', 10, 0.3, 10, 0.5, 6.5, 0, '#87CEEB', 'Glass')
    ];

    return {
      id: `${category}_${pad}`,
      category,
      name: `${config.baseName} Design ${pad} — ${style}`,
      style,
      length: 30,
      width: 20,
      height: 10,
      area: 600,
      wallColor: palette.wall,
      floorMaterial: palette.floor,
      ceilingColor: '#FFFFFF',
      lightingMood: palette.mood,
      description: `Architectural ${style} layout with optimized circulation, custom-specified furniture coordinates, and balanced natural illumination.`,
      features: [`${style} Custom Spatial Layout`, 'Coordinated Architectural Materials', 'Energy-Efficient Lighting Schedule'],
      tags: [style.split(' ')[0], palette.floor.split(' ')[0], 'Full 2D/3D'],
      objects
    };
  });
};

// All 100 Designs: 10 designs for each of the 10 major room categories!
export const allRoomDesigns: Record<RoomCategory, RoomDesign[]> = {
  living_room: livingRoomDesigns,
  bathroom: generateCategoryDesigns('bathroom'),
  dining_room: generateCategoryDesigns('dining_room'),
  bedroom: generateCategoryDesigns('bedroom'),
  master_bedroom: generateCategoryDesigns('master_bedroom'),
  kitchen: generateCategoryDesigns('kitchen'),
  drawing_room: generateCategoryDesigns('drawing_room'),
  guest_room: generateCategoryDesigns('guest_room'),
  study_room: generateCategoryDesigns('study_room'),
  family_room: generateCategoryDesigns('family_room'),
  balcony: [],
  staircase: [],
  parking: [],
};

export const getAllDesignsList = (): RoomDesign[] => {
  return Object.values(allRoomDesigns).flat();
};

export const getDesignsByCategory = (category: RoomCategory): RoomDesign[] => {
  return allRoomDesigns[category] || [];
};

export const getDesignById = (id: string): RoomDesign | undefined => {
  return getAllDesignsList().find(d => d.id === id);
};

export const roomCategoryMetadata: { key: RoomCategory; label: string; icon: string; count: number }[] = [
  { key: 'living_room', label: 'Living Room', icon: 'Sofa', count: 10 },
  { key: 'master_bedroom', label: 'Master Bedroom', icon: 'Crown', count: 10 },
  { key: 'bedroom', label: 'Bedroom', icon: 'Bed', count: 10 },
  { key: 'kitchen', label: 'Kitchen', icon: 'Utensils', count: 10 },
  { key: 'dining_room', label: 'Dining Room', icon: 'Coffee', count: 10 },
  { key: 'bathroom', label: 'Bathroom', icon: 'Bath', count: 10 },
  { key: 'drawing_room', label: 'Drawing Room', icon: 'Armchair', count: 10 },
  { key: 'family_room', label: 'Family Lounge', icon: 'Tv', count: 10 },
  { key: 'study_room', label: 'Study / Office', icon: 'BookOpen', count: 10 },
  { key: 'guest_room', label: 'Guest Room', icon: 'Users', count: 10 },
];
