import { TemplateConfig } from '../types';

const danube3Template: TemplateConfig = {
  bosToken: '<s>',
  eosToken: '</s>',
  // prettier-ignore
  chatTemplate: 
    "{%- if messages[0].role == 'system' -%}" +
      "{%- set system_message = messages[0].content | trim + eos_token -%}" +
      "{%- set messages = messages.slice(1) -%}" +
    "{%- else -%}" +
      "{%- set system_message = '' -%}" +
    "{%- endif %}" +
    "{{- system_message -}}" +

    "{%- for message in messages -%}" +
      "{%- if ((message['role'] == 'user') != (loop.index0 % 2 == 0)) or ((message['role'] == 'assistant') != (loop.index0 % 2 == 1)) -%}" + 
        "{{- raise_exception('Conversation roles must alternate user/assistant/user/assistant/...') -}}" + 
      "{%- endif -%}" + 
      "{%- if message['role'] == 'user' -%}" + 
        "{{- '<|prompt|>' + message['content'] | trim + eos_token -}}" + 
      "{%- elif message['role'] == 'assistant' -%}" + 
        "{{- '<|answer|>' + message['content'] | trim + eos_token -}}" + 
      "{%- endif -%}" +
    "{%- endfor -%}" + 

    "{%- if add_generation_prompt -%}" +
      "{{- '<|answer|>' -}}" +
    "{%- endif -%}"
};

export default danube3Template;
