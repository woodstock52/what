
export enum TaxType {
  VAT = 'VAT',
  CORPORATE_TAX = 'Corporate Tax',
  EXCISE_TAX = 'Excise Tax',
  CUSTOMS = 'Customs Duty',
  GENERAL = 'General Inquiry'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  taxType?: TaxType;
  sources?: GroundingSource[];
  timestamp: number;
}

export interface TaxQueryResponse {
  answer: string;
  sources: GroundingSource[];
}
