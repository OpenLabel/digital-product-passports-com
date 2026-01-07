import { CategoryTemplate } from './base';
import { wineTemplate } from './wine';
import { batteryTemplate } from './battery';
import { textilesTemplate } from './textiles';
import { otherTemplate } from './other';
import type { ProductCategory } from '@/types/passport';

export const templates: Record<ProductCategory, CategoryTemplate> = {
  wine: wineTemplate,
  battery: batteryTemplate,
  textiles: textilesTemplate,
  other: otherTemplate,
};

export const getTemplate = (category: ProductCategory): CategoryTemplate => {
  return templates[category] || otherTemplate;
};

export const categoryList = [
  { value: 'other' as const, label: 'Other', icon: '📦' },
  { value: 'wine' as const, label: 'Wine', icon: '🍷' },
  { value: 'battery' as const, label: 'Battery', icon: '🔋' },
  { value: 'textiles' as const, label: 'Textiles', icon: '👕' },
];

export * from './base';
