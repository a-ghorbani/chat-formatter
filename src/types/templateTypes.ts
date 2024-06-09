export interface TemplateConfig {
    bosToken: string;
    eosToken: string;
    chatTemplate: string;
  }
  
export interface Templates {
  [key: string]: TemplateConfig;
}