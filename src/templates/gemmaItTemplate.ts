import { TemplateConfig } from '../types';

const gemmaItTemplate: TemplateConfig = {
  bosToken: '<bos>',
  eosToken: '<eos>',
  addBosToken: false, // It is already part of the chatTemplate
  addEosToken: false,
  // prettier-ignore
  chatTemplate:
    "{{- bos_token -}}" +

    "{%- if messages[0].role == 'system' -%}" +
      "{%- set system_message = messages[0].content | trim + '\\n\\n' -%}" +
      "{%- set messages = messages.slice(1) -%}" +
    "{%- else -%}" +
      "{%- set system_message = '' -%}" +
    "{%- endif %}" +

    "{%- for message in messages -%}" +
      "{%- if (message.role == 'user') != (loop.index0 % 2 == 0) -%}" +
        "{{- raise_exception('Conversation roles must alternate user/assistant/user/assistant/...') -}}" +
      "{%- endif -%}" +

      "{%- if loop.index0 == 0 -%}" +
        "{%- set content = system_message + message.content -%}" +
      "{%- else -%}" +
        "{%- set content = message.content -%}" +
      "{%- endif -%}" +

      "{%- if message.role == 'assistant' -%}" +
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

export default gemmaItTemplate;
