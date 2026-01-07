import { BaseTemplate, TemplateSection } from './base';

export class OtherTemplate extends BaseTemplate {
  id = 'other';
  name = 'Other';
  description = 'Generic Digital Product Passport for any product type';
  icon = '📦';
  
  sections: TemplateSection[] = [];
  
  getRequiredLogos(): string[] {
    return [];
  }
}

export const otherTemplate = new OtherTemplate();
