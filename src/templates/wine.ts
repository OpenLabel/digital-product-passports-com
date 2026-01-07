import { BaseTemplate, TemplateSection } from './base';

export class WineTemplate extends BaseTemplate {
  id = 'wine';
  name = 'Wine';
  description = 'Digital Product Passport for wine products with EU/French regulatory compliance';
  icon = '🍷';
  
  sections: TemplateSection[] = [
    {
      title: 'Product Origin & Classification',
      description: 'Information about the wine origin and protected designations',
      questions: [
        {
          id: 'has_pdo',
          label: 'Does this wine have a Protected Designation of Origin (PDO/AOP)?',
          type: 'checkbox',
          helpText: 'PDO wines must display the official EU PDO logo'
        },
        {
          id: 'has_pgi',
          label: 'Does this wine have a Protected Geographical Indication (PGI/IGP)?',
          type: 'checkbox',
          helpText: 'PGI wines must display the official EU PGI logo'
        },
        {
          id: 'appellation',
          label: 'Appellation/Region Name',
          type: 'text',
          placeholder: 'e.g., Bordeaux, Champagne, Burgundy'
        },
        {
          id: 'vintage_year',
          label: 'Vintage Year',
          type: 'number',
          placeholder: 'e.g., 2020'
        },
        {
          id: 'grape_variety',
          label: 'Grape Variety(ies)',
          type: 'text',
          placeholder: 'e.g., Cabernet Sauvignon, Merlot'
        }
      ]
    },
    {
      title: 'Certifications & Labels',
      description: 'Organic, biodynamic, and sustainability certifications',
      questions: [
        {
          id: 'is_organic_eu',
          label: 'Is this wine certified organic (EU Organic)?',
          type: 'checkbox',
          helpText: 'Must display the EU organic leaf logo'
        },
        {
          id: 'is_biodynamic',
          label: 'Is this wine biodynamic certified (Demeter/Biodyvin)?',
          type: 'checkbox'
        },
        {
          id: 'is_hve',
          label: 'Is the vineyard HVE certified (Haute Valeur Environnementale)?',
          type: 'checkbox',
          helpText: 'French environmental certification'
        },
        {
          id: 'is_terra_vitis',
          label: 'Is this wine Terra Vitis certified?',
          type: 'checkbox'
        }
      ]
    },
    {
      title: 'Content & Allergen Information',
      description: 'Mandatory labeling requirements per EU Regulation 2019/787',
      questions: [
        {
          id: 'alcohol_content',
          label: 'Alcohol Content (%)',
          type: 'number',
          placeholder: 'e.g., 13.5',
          required: true
        },
        {
          id: 'contains_sulfites',
          label: 'Contains sulfites?',
          type: 'checkbox',
          helpText: 'Mandatory warning if sulfites exceed 10mg/L'
        },
        {
          id: 'contains_egg',
          label: 'Contains egg allergens (fining agents)?',
          type: 'checkbox'
        },
        {
          id: 'contains_milk',
          label: 'Contains milk allergens (fining agents)?',
          type: 'checkbox'
        },
        {
          id: 'nutritional_declaration',
          label: 'Include nutritional declaration?',
          type: 'checkbox',
          helpText: 'Required for wines produced after December 8, 2023'
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
          id: 'country_of_origin',
          label: 'Country of Origin',
          type: 'text',
          required: true,
          placeholder: 'e.g., France'
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
