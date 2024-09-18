import defaultTemplate from './defaultTemplate';
import chatMLTemplate from './chatMLTemplate';
import llama3Template from './llama3Template';
import phi3Template from './phi3Template';
import gemmaItTemplate from './gemmaItTemplate';
import gemmasutraTemplate from './gemmasutraTemplate';
import danube2Template from './danube2Template';
import danube3Template from './danube3Template';
import qwen2Template from './qwen2Template';
import qwen25Template from './qwen2.5Template';
import { Templates } from '../types';

export const templates: Templates = {
  default: defaultTemplate,
  chatML: chatMLTemplate,
  llama3: llama3Template,
  phi3: phi3Template,
  gemmaIt: gemmaItTemplate,
  gemmasutra: gemmasutraTemplate,
  danube2: danube2Template,
  danube3: danube3Template,
  qwen2: qwen2Template,
  qwen25: qwen25Template
};
