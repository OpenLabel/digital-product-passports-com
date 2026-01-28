import { BaseTemplate, TemplateSection } from './base';

export class WineTemplate extends BaseTemplate {
  id = 'wine';
  name = 'Wine';
  description = 'Digital Product Passport for wine products with EU Regulation 2021/2117 compliance';
  icon = '🍷';
  
  // Wine uses a custom component (WineFields) for its form,
  // so sections are kept minimal - the component handles the complex logic
  sections: TemplateSection[] = [
    {
      title: 'Certifications & Labels',
      description: 'Organic, biodynamic, and sustainability certifications',
      questions: [
        {
          id: 'has_pdo',
          label: 'Protected Designation of Origin (PDO/AOP)',
          type: 'checkbox',
          helpText: 'PDO wines must display the official EU PDO logo'
        },
        {
          id: 'has_pgi',
          label: 'Protected Geographical Indication (PGI/IGP)',
          type: 'checkbox',
          helpText: 'PGI wines must display the official EU PGI logo'
        },
        {
          id: 'is_organic_eu',
          label: 'EU Organic certified',
          type: 'checkbox',
          helpText: 'Must display the EU organic leaf logo'
        },
        {
          id: 'is_biodynamic',
          label: 'Biodynamic certified (Demeter/Biodyvin)',
          type: 'checkbox'
        },
        {
          id: 'is_hve',
          label: 'HVE certified (Haute Valeur Environnementale)',
          type: 'checkbox',
          helpText: 'French environmental certification'
        },
        {
          id: 'is_terra_vitis',
          label: 'Terra Vitis certified',
          type: 'checkbox'
        }
      ]
    },
    {
      title: 'Allergen Information',
      description: 'Mandatory allergen labeling per EU Regulation',
      questions: [
        {
          id: 'contains_sulfites',
          label: 'Contains sulfites',
          type: 'checkbox',
          helpText: 'Mandatory warning if sulfites exceed 10mg/L'
        },
        {
          id: 'contains_egg',
          label: 'Contains egg allergens (fining agents)',
          type: 'checkbox'
        },
        {
          id: 'contains_milk',
          label: 'Contains milk allergens (fining agents)',
          type: 'checkbox'
        }
      ]
    },
    {
      title: 'Producer Information',
      description: 'Information about the wine producer',
      questions: [
        {
          id: 'producer_name',
          label: 'Producer/Winery Name',
          type: 'text',
          required: true
        },
        {
          id: 'bottler_info',
          label: 'Bottler Information',
          type: 'textarea',
          placeholder: 'Name and address of bottler'
        }
      ]
    }
  ];

  getRequiredLogos(data: Record<string, unknown>): string[] {
    const logos: string[] = [];
    
    if (data.has_pdo) logos.push('eu-pdo');
    if (data.has_pgi) logos.push('eu-pgi');
    if (data.is_organic_eu) logos.push('eu-organic');
    if (data.is_biodynamic) logos.push('demeter');
    if (data.is_hve) logos.push('hve');
    if (data.is_terra_vitis) logos.push('terra-vitis');
    
    return logos;
  }
}

export const wineTemplate = new WineTemplate();

// Sugar classification options based on EU wine regulations
export const sugarClassifications = [
  { value: 'brut_nature', label: 'Brut Nature (0-3 g/L)' },
  { value: 'extra_brut', label: 'Extra Brut (0-6 g/L)' },
  { value: 'brut', label: 'Brut (0-12 g/L)' },
  { value: 'extra_dry', label: 'Extra Dry (12-17 g/L)' },
  { value: 'dry', label: 'Dry / Sec (17-32 g/L)' },
  { value: 'demi_sec', label: 'Demi-Sec (32-50 g/L)' },
  { value: 'sweet', label: 'Sweet / Doux (>50 g/L)' },
];

// Volume unit options
export const volumeUnits = [
  { value: 'ml', label: 'ml' },
  { value: 'cl', label: 'cl' },
  { value: 'L', label: 'L' },
];

// Common countries for wine production
export const wineCountries = [
  'France', 'Italy', 'Spain', 'Portugal', 'Germany', 
  'Austria', 'Greece', 'Hungary', 'Romania', 'Bulgaria',
  'Croatia', 'Slovenia', 'Czech Republic', 'Slovakia',
  'United States', 'Argentina', 'Chile', 'Australia', 
  'New Zealand', 'South Africa', 'China', 'Other'
];
