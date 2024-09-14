import { TemplateConfig } from '../types';

const qwen2Template: TemplateConfig = {
  bosToken: '',
  eosToken: '<|im_end|>',
  addBosToken: false,
  addEosToken: false,
  // prettier-ignore
  chatTemplate: 
    "{%- for message in messages -%}" +
      "{%- if loop.first and messages[0].role != 'system' -%}" +
        "{{- '<|im_start|>system\\nYou are a helpful assistant<|im_end|>\\n' -}}" +
      "{%- endif -%}" +

      "{{- '<|im_start|>' + message.role + '\\n' + message.content + '<|im_end|>\\n' -}}" +
    "{%- endfor -%}" +

    "{%- if add_generation_prompt -%}" +
      "{{- '<|im_start|>assistant\\n' -}}" +
    "{%- endif -%}"
};

export default qwen2Template;
