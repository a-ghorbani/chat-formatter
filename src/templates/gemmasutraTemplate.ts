import { TemplateConfig } from '../types';

// https://huggingface.co/TheDrummer/Gemmasutra-Mini-2B-v1#usage

const gemmasutraTemplate: TemplateConfig = {
  bosToken: '<bos>',
  eosToken: '<eos>',
  // prettier-ignore
  chatTemplate:
    "{{- bos_token -}}" +
    "{%- for message in messages -%}" +
      "{%- set content = message.content -%}" +
      "{%- if (message.role == 'assistant') -%}" +
        "{%- set role = 'model' -%}" +
      "{%- else -%}" +
        "{%- set role = message.role -%}" +
      "{%- endif -%}" +
      "{{- '<start_of_turn>' + role + '\\n' + (content | trim) + '<end_of_turn>\\n' -}}" +
    "{%- endfor -%}" +
    "{%- if add_generation_prompt -%}" +
      "{{- '<start_of_turn>model\\n' -}}" +
    "{%- endif -%}"
};

export default gemmasutraTemplate;
