import { CategoryTemplate } from './base';
import { wineTemplate } from './wine';
import { batteryTemplate } from './battery';
import { textilesTemplate } from './textiles';
import { constructionTemplate } from './construction';
import { electronicsTemplate } from './electronics';
import { ironSteelTemplate } from './iron_steel';
import { aluminumTemplate } from './aluminum';
import { toysTemplate } from './toys';
import { cosmeticsTemplate } from './cosmetics';
import { furnitureTemplate } from './furniture';
import { tiresTemplate } from './tires';
import { detergentsTemplate } from './detergents';
import { otherTemplate } from './other';
import type { ProductCategory } from '@/types/passport';

export const templates: Record<ProductCategory, CategoryTemplate> = {
  wine: wineTemplate,
  battery: batteryTemplate,
  textiles: textilesTemplate,
  construction: constructionTemplate,
  electronics: electronicsTemplate,
  iron_steel: ironSteelTemplate,
  aluminum: aluminumTemplate,
  toys: toysTemplate,
  cosmetics: cosmeticsTemplate,
  furniture: furnitureTemplate,
  tires: tiresTemplate,
  detergents: detergentsTemplate,
  other: otherTemplate,
};

export const getTemplate = (category: ProductCategory): CategoryTemplate => {
  return templates[category] || otherTemplate;
};

export const categoryList = [
  { value: 'battery' as const, label: 'Batteries', icon: '🔋', status: 'active' as const, regulation: 'EU 2023/1542' },
  { value: 'construction' as const, label: 'Construction', icon: '🏗️', status: 'active' as const, regulation: 'EU 2024/3110' },
  { value: 'textiles' as const, label: 'Textiles', icon: '👕', status: 'active' as const, regulation: 'ESPR Framework' },
  { value: 'wine' as const, label: 'Wine & Spirits', icon: '🍷', status: 'active' as const, regulation: 'EU 2021/2117' },
  { value: 'toys' as const, label: 'Toys', icon: '🧸', status: 'active' as const, regulation: 'EU 2025/2509' },
  { value: 'electronics' as const, label: 'Electronics', icon: '📱', status: 'priority' as const, regulation: 'ESPR Priority' },
  { value: 'iron_steel' as const, label: 'Iron & Steel', icon: '🔩', status: 'priority' as const, regulation: 'CBAM aligned' },
  { value: 'aluminum' as const, label: 'Aluminum', icon: '🥫', status: 'priority' as const, regulation: 'ESPR 2025-2030' },
  { value: 'cosmetics' as const, label: 'Cosmetics', icon: '💄', status: 'priority' as const, regulation: 'ESPR Priority' },
  { value: 'furniture' as const, label: 'Furniture', icon: '🛋️', status: 'priority' as const, regulation: 'ESPR + EUDR' },
  { value: 'tires' as const, label: 'Tires', icon: '🛞', status: 'priority' as const, regulation: 'ESPR Priority' },
  { value: 'detergents' as const, label: 'Detergents', icon: '🧴', status: 'priority' as const, regulation: 'CLP/Detergents Reg' },
  { value: 'other' as const, label: 'Other', icon: '📦', status: 'active' as const, regulation: 'Generic DPP' },
];

export * from './base';
