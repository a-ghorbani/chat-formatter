
# A TypeScript Library for Formatting Chat


Chat Formatter is a TypeScript library meant to format chat history using [Nunjucks](https://mozilla.github.io/nunjucks/) templating (similar to [Jinja2](http://jinja.pocoo.org/)). It comes with templates for various models like chatML, Llama-3, Phi-3, Gemma-it, and H2O.ai's danube2.

Chat models are trained with unique formats to convert conversation history, like:
```Python
chat = [
   {"role": "user", "content": "Hello, how are you?"},
   {"role": "assistant", "content": "I'm doing great. How can I help you today?"},
   {"role": "user", "content": "I'd like to show off how chat templating works!"},
]
```

into a single tokenizable string, like:
 ```Python
 "<s>[INST] Hello, how are you? [/INST]I'm doing great. How can I help you today?</s> [INST] I'd like to show off how chat templating works! [/INST]"
 ```

Each model requires a different format, and not following this can cause performance issues. There are Python tools for this (like [this](https://huggingface.co/docs/transformers/main/en/chat_templating) one and [this one](https://github.com/chujiezheng/chat_templates)). Hugging Face tokenizers use chat_template with a Jinja template to format conversations correctly.

For those who need this in a TypeScript or JavaScript runtime, this library uses the Nunjucks templating engine, which is mostly compatible with Jinja2 and with minor tweaks, it should work seamlessly.

## Installation

You can install Chat Formatter via npm:

```bash
npm install chat-formatter
```

## Usage

### Importing the Library

```typescript
import { applyTemplate, Conversation } from 'chat-formatter';
```

### Formatting a Conversation

Here's how you can format a conversation using the default template (i.e. chatML format):

```typescript
const conversation: Conversation = [
  { role: 'user', content: 'Hi there!' },
  { role: 'assistant', content: 'Hello, how can I help you today?' },
  { role: 'user', content: 'Can I ask a question?'}
];

// Using the default template without a generation prompt
const formatted = await applyTemplate(conversation);
console.log(formatted);
```

Expected output:

```
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>

```

and with generation prompt:
```typescript
const formatted = await applyTemplate(conversation, {addGenerationPrompt: true});
```
Expected output:

```
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant

```

### Using Different Templates (Llama-3)

You can specify a different template using the `templateKey` option:

```typescript
const conversation: Conversation = [
  { role: 'system', content: 'System prompt.' },
  { role: 'user', content: 'Hi there!' },
  { role: 'assistant', content: 'Nice to meet you!' },
  { role: 'user', content: 'Can I ask a question?' }
];

const result = await applyTemplate(conversation, { 
  templateKey: 'llama3', 
  addGenerationPrompt: true 
});
console.log(result);
```

Expected output:

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>

System prompt.<|eot_id|><|start_header_id|>user<|end_header_id|>

Hi there!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Nice to meet you!<|eot_id|><|start_header_id|>user<|end_header_id|>

Can I ask a question?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

```

###  Using Different Templates (Danube2)

Some models, such as Danube2, do not accept system prompts. The [original template of Danube2](https://huggingface.co/h2oai/h2o-danube2-1.8b-chat/blob/main/tokenizer_config.json) suggest throwing an exception.
```json
  "chat_template": "{% for message in messages %}{% if message['role'] == 'user' %}{{ '<|prompt|>' + message['content'] + eos_token }}{% elif message['role'] == 'system' %}{{ raise_exception('System role not supported') }}{% elif message['role'] == 'assistant' %}{{ '<|answer|>'  + message['content'] + eos_token }}{% endif %}{% if loop.last and add_generation_prompt %}{{ '<|answer|>' }}{% endif %}{% endfor %}"
```

The templates in this repo incorporate system prompts as closely as possible to what a working workaround could be.  

```typescript
const conversation: Conversation = [
  { role: 'system', content: 'System prompt.' },
  { role: 'user', content: 'Hi there!' },
  { role: 'assistant', content: 'Nice to meet you!' },
  { role: 'user', content: 'Can I ask a question?' }
];
const resultWithPrompt = await applyTemplate(conversation, {
  templateKey: 'danube2',
  addGenerationPrompt: true
});
console.log(resultWithPrompt);
```

Expected output:

```
'System prompt.<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s><|answer|>'
```

###  Using Custom Templates 

Let's say this code doesn't have a template for Qwen1.5.

We need to get the chat template (most probably it is stated somewhere in Jinja format). For Qwen1.5, we will head to the model repository on HF and look at [tokenizer_config.json line 31](https://huggingface.co/Qwen/Qwen1.5-72B-Chat/blob/main/tokenizer_config.json#L31), where `chat_template` is defined. It is: 
```json
    "chat_template": "{% for message in messages %}{% if loop.first and messages[0]['role'] != 'system' %}{{ '<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n' }}{% endif %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}",
```
We need to make sure this is compatible with Nunjucks.

Luckily, in this case, we don't need to change anything; we are just going to use the template as is:
```typescript
const template: TemplateConfig = {
  bosToken: '',
  eosToken: '<|im_end|>"',
  chatTemplate:
    "{% for message in messages %}{% if loop.first and messages[0]['role'] != 'system' %}{{ '<|im_start|>system\nYou are a helpful assistant.<|im_end|>\n' }}{% endif %}{{'<|im_start|>' + message['role'] + '\n' + message['content'] + '<|im_end|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_start|>assistant\n' }}{% endif %}"
};
```
The values of  `bosToken` and `eosToken` are also taken from `tokenizer_config.json`. Note if either of these tokens are null, we use an emapty string.

```typescript
const conversation: Conversation = [
  { role: 'user', content: 'Hi there!' },
  { role: 'assistant', content: 'Nice to meet you!' },
  { role: 'user', content: 'Can I ask a question?' }
];

const result = await applyTemplate(conversation, {
  customTemplate: template
});
console.log('result: ', result);
```

Expected output:
```
<|im_start|>system
You are a helpful assistant.<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
```

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
