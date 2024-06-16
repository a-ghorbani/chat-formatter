import { TemplateConfig } from '../types';

const defaultTemplate: TemplateConfig = {
  bosToken: '',
  eosToken: '',
  // prettier-ignore
  chatTemplate:
        "{%- for message in messages -%}" +
        "    {{'<|im_start|>' + message.role + '\n' + message.content + '<|im_end|>\n'}}" + 
        "{%- endfor -%}" +
        "{%- if add_generation_prompt and messages[messages.length - 1].role != 'assistant' -%}" +
        "    {{ '<|im_start|>assistant\n' }}" +
        "{%- endif -%}"
};

export default defaultTemplate;
