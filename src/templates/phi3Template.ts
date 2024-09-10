import { TemplateConfig } from '../types';

const phi3Template: TemplateConfig = {
  bosToken: '<s>',
  eosToken: '<|endoftext|>',
  addBosToken: false,
  addEosToken: false,
  // prettier-ignore
  chatTemplate:
   "{%- for message in messages -%}" +
      "{%- if message.role == 'system' -%}" +
        "{{- '<|system|>\\n' + message.content | trim + '<|end|>\\n' -}}" +
      "{%- elif message.role == 'user' -%}" +
        "{{- '<|user|>\\n' + message.content | trim + '<|end|>\\n' -}}" +
      "{%- elif message.role == 'assistant' -%}" +
        "{{- '<|assistant|>\\n' + message.content | trim + '<|end|>\\n' -}}" +
      "{%- endif -%}" +
    "{%- endfor -%}" +

    "{%- if add_generation_prompt -%}" +
      "{{- '<|assistant|>\\n' -}}" +
    "{%- else -%}" +
      "{{- eos_token -}}" +
    "{%- endif -%}"
};

export default phi3Template;
