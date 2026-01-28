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

// Volume unit options
export const volumeUnits = [
  { value: 'ml', label: 'ml' },
  { value: 'cl', label: 'cl' },
  { value: 'L', label: 'L' },
];

// All countries in the world for wine origin
export const wineCountries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
  'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
  'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
  'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Democratic Republic)', 'Congo (Republic)',
  'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
  'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea',
  'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq',
  'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati',
  'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
  'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
  'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia',
  'Solomon Islands', 'Somalia', 'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
  'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];
