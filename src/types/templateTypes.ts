export interface TemplateConfig {
  bosToken: string;
  eosToken: string;
  addBosToken?: boolean;
  addEosToken?: boolean;
  chatTemplate: string;
}

export interface Templates {
  [key: string]: TemplateConfig;
}
