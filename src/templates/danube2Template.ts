import { TemplateConfig } from '../types';

const danube2Template: TemplateConfig = {
  bosToken: '<s>',
  eosToken: '</s>',
  // prettier-ignore
  chatTemplate:
    "{%- if messages[0].role == 'system' -%}" +
    "    {%- set system_message = messages[0].content + eos_token -%}" +
    "    {%- set messages = messages.slice(1) -%}" +
    "{%- else -%}" +
    "    {%- set system_message = '' -%}" +
    "{%- endif %}" +
    "{{- system_message -}}" +
    "{%- for message in messages -%}" +
    "    {%- if message.role == 'user' -%}" +
    "        {{- '<|prompt|>' + message.content + eos_token -}}" +
    "    {%- elif message.role == 'assistant' -%}" +
    "        {{- '<|answer|>'  + message['content'] + eos_token -}}" +
    "    {%- endif -%}" +
    "    {%- if loop.last and add_generation_prompt -%}" +
    "        {{- '<|answer|>' -}}" +
    "    {%- endif -%}" +
    "{%- endfor -%}"
};

export default danube2Template;
