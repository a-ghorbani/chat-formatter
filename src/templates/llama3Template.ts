import { TemplateConfig } from '../types';

const llama3Template: TemplateConfig = {
  bosToken: '<|begin_of_text|>',
  eosToken: '<|end_of_text|>',
  addBosToken: false,
  addEosToken: false,
  // prettier-ignore
  chatTemplate:
    "{%- set loop_messages = messages -%}" +
    "{%- for message in loop_messages -%}" +
    "    {%- set content = '<|start_header_id|>' + message.role + '<|end_header_id|>\n\n'+ message.content | trim + '<|eot_id|>' -%}" +
    "    {%- if loop.index0 == 0 -%}" +
    "        {%- set content = bos_token + content -%}" +
    "    {%- endif -%}" +
    "    {{- content -}}" +
    "{%- endfor -%}" +
    "{%- if add_generation_prompt -%}" +
    "    {{- '<|start_header_id|>assistant<|end_header_id|>\n\n' -}}" +
    "{%- endif -%}"
};

export default llama3Template;
