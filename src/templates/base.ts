export interface TemplateQuestion {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
}

export interface TemplateSection {
  title: string;
  description?: string;
  questions: TemplateQuestion[];
}

export interface CategoryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: TemplateSection[];
  getRequiredLogos?: (data: Record<string, unknown>) => string[];
}

export abstract class BaseTemplate implements CategoryTemplate {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract icon: string;
  abstract sections: TemplateSection[];
  
  getRequiredLogos?(data: Record<string, unknown>): string[];
}
