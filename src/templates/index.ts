import defaultTemplate from './defaultTemplate';
import chatMLTemplate from './chatMLTemplate';
import llama3Template from './llama3Template';
import phi3Template from './phi3Template';
import gemmaItTemplate from './gemmaItTemplate';
import danube2Template from './danube2Template';
import { Templates } from '../types';

export const templates: Templates = {
  default: defaultTemplate,
  chatML: chatMLTemplate,
  llama3: llama3Template,
  phi3: phi3Template,
  gemmaIt: gemmaItTemplate,
  danube2: danube2Template
};
