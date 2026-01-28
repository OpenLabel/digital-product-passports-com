export interface MaterialType {
  id: string;
  name: string;
  icon: string; // emoji as placeholder
}

export interface MaterialComposition {
  id: string;
  name: string;
  code?: string;
  categoryId: string;
}

export interface DisposalMethod {
  id: string;
  name: string;
}

export const packagingMaterialTypes: MaterialType[] = [
  { id: 'bottle', name: 'Bottle', icon: '🍾' },
  { id: 'capsule', name: 'Capsule', icon: '⚫' },
  { id: 'cage', name: 'Cage', icon: '🔗' },
  { id: 'cork', name: 'Cork', icon: '🪵' },
  { id: 'cardboard', name: 'Cardboard', icon: '📦' },
  { id: 'bag', name: 'Bag', icon: '👜' },
  { id: 'tap', name: 'Tap', icon: '🚰' },
];

export const materialCompositions: MaterialComposition[] = [
  // Glass
  { id: 'gl_70', name: 'Colorless glass', code: 'GL 70', categoryId: 'glass' },
  { id: 'gl_71', name: 'Green glass', code: 'GL 71', categoryId: 'glass' },
  { id: 'gl_72', name: 'Brown glass', code: 'GL 72', categoryId: 'glass' },
  { id: 'gl_73', name: 'Black glass', code: 'GL 73', categoryId: 'glass' },
  
  // Plastics
  { id: 'pet_1', name: 'PET', code: 'PET 1', categoryId: 'plastic' },
  { id: 'hdpe_2', name: 'HDPE', code: 'HDPE 2', categoryId: 'plastic' },
  { id: 'pvc_3', name: 'PVC', code: 'PVC 3', categoryId: 'plastic' },
  { id: 'ldpe_4', name: 'LDPE', code: 'LDPE 4', categoryId: 'plastic' },
  { id: 'pp_5', name: 'PP', code: 'PP 5', categoryId: 'plastic' },
  { id: 'ps_6', name: 'PS', code: 'PS 6', categoryId: 'plastic' },
  
  // Metals
  { id: 'fe_40', name: 'Steel', code: 'FE 40', categoryId: 'metal' },
  { id: 'alu_41', name: 'Aluminum', code: 'ALU 41', categoryId: 'metal' },
  { id: 'tinplate', name: 'Tinplate', code: 'FE 40', categoryId: 'metal' },
  
  // Paper/Cardboard
  { id: 'pap_20', name: 'Corrugated cardboard', code: 'PAP 20', categoryId: 'paper' },
  { id: 'pap_21', name: 'Non-corrugated cardboard', code: 'PAP 21', categoryId: 'paper' },
  { id: 'pap_22', name: 'Paper', code: 'PAP 22', categoryId: 'paper' },
  
  // Wood/Cork
  { id: 'for_50', name: 'Wood', code: 'FOR 50', categoryId: 'wood' },
  { id: 'for_51', name: 'Cork', code: 'FOR 51', categoryId: 'wood' },
  
  // Composites
  { id: 'c_pap', name: 'Composite paper/cardboard', code: 'C/PAP', categoryId: 'composite' },
  { id: 'c_ldpe', name: 'Composite plastic', code: 'C/LDPE', categoryId: 'composite' },
];

export const materialCategories = [
  { id: 'glass', name: 'Glass' },
  { id: 'plastic', name: 'Plastics' },
  { id: 'metal', name: 'Metals' },
  { id: 'paper', name: 'Paper/Cardboard' },
  { id: 'wood', name: 'Wood/Cork' },
  { id: 'composite', name: 'Composites' },
];

export const disposalMethods: DisposalMethod[] = [
  { id: 'plastic_collection', name: 'Plastic collection' },
  { id: 'dedicated_waste', name: 'Dedicated waste collection' },
  { id: 'paper_collection', name: 'Paper collection' },
  { id: 'steel_collection', name: 'Steel collection' },
  { id: 'glass_collection', name: 'Glass collection' },
  { id: 'residual_waste', name: 'Residual waste collection' },
  { id: 'organic_waste', name: 'Organic waste collection' },
  { id: 'textile_collection', name: 'Textile collection' },
];

export interface PackagingMaterial {
  id: string;
  typeId: string;
  typeName: string;
  compositionId?: string;
  compositionName?: string;
  compositionCode?: string;
  disposalMethodId?: string;
  disposalMethodName?: string;
  isCustomType?: boolean;
  customTypeName?: string;
}

export const getCompositionsByCategory = () => {
  return materialCategories.map((cat) => ({
    ...cat,
    compositions: materialCompositions.filter((m) => m.categoryId === cat.id),
  }));
};
