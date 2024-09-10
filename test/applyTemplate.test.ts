// tests/applyTemplate.test.ts

import applyTemplate from '../src/core/applyTemplate';
import { TemplateConfig } from '../src/types';
import { Conversation } from '../src/types/conversation';

describe('Template Rendering Tests', () => {
  const baseConversation: Conversation = [
    { role: 'user', content: 'Hi there!' },
    { role: 'assistant', content: 'Nice to meet you!' },
    { role: 'user', content: 'Can I ask a question?' }
  ];

  const conversationWithSystem: Conversation = [
    { role: 'system', content: 'System prompt.' },
    ...baseConversation
  ];

  describe('Default Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        `<|im_start|>system
System prompt.<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, config);
      expect(result).toBe(expected);
    });
  });

  describe('chatML Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        `<|im_start|>system
System prompt.<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, {
        templateKey: 'chatML',
        ...config
      });
      expect(result).toBe(expected);
    });
  });

  describe('chatMLTemplate Tests', () => {
    it('should throw an error for incorrect role sequence', () => {
      const badConversation: Conversation = [
        { role: 'user', content: 'Hi!' },
        { role: 'user', content: 'Still there?' } // Incorrect sequence
      ];

      expect(() => {
        applyTemplate(badConversation, { templateKey: 'chatML' });
      }).toThrow(
        /Conversation roles must alternate user\/assistant\/user\/assistant\//
      );
    });
  });

  describe('Llama-3 Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

Hi there!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Nice to meet you!<|eot_id|><|start_header_id|>user<|end_header_id|>

Can I ask a question?<|eot_id|>`
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

Hi there!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Nice to meet you!<|eot_id|><|start_header_id|>user<|end_header_id|>

Can I ask a question?<|eot_id|>`
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

Hi there!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Nice to meet you!<|eot_id|><|start_header_id|>user<|end_header_id|>

Can I ask a question?<|eot_id|><|end_of_text|>`
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

Hi there!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Nice to meet you!<|eot_id|><|start_header_id|>user<|end_header_id|>

Can I ask a question?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

System prompt.<|eot_id|><|start_header_id|>user<|end_header_id|>

Hi there!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Nice to meet you!<|eot_id|><|start_header_id|>user<|end_header_id|>

Can I ask a question?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, {
        templateKey: 'llama3',
        ...config
      });
      expect(result).toBe(expected);
    });
  });

  describe('Phi-3 Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        `<|user|>
Hi there!<|end|>
<|assistant|>
Nice to meet you!<|end|>
<|user|>
Can I ask a question?<|end|>
<|endoftext|>`
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        `<|user|>
Hi there!<|end|>
<|assistant|>
Nice to meet you!<|end|>
<|user|>
Can I ask a question?<|end|>
<|endoftext|>`
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        `<s><|user|>
Hi there!<|end|>
<|assistant|>
Nice to meet you!<|end|>
<|user|>
Can I ask a question?<|end|>
<|endoftext|>`
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        `<|user|>
Hi there!<|end|>
<|assistant|>
Nice to meet you!<|end|>
<|user|>
Can I ask a question?<|end|>
<|assistant|>
`
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        `<|system|>
System prompt.<|end|>
<|user|>
Hi there!<|end|>
<|assistant|>
Nice to meet you!<|end|>
<|user|>
Can I ask a question?<|end|>
<|assistant|>
`
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, {
        templateKey: 'phi3',
        ...config
      });
      expect(result).toBe(expected);
    });
  });

  describe('Gemma-it Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        `<bos><start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
`
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        `<bos><start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
`
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        `<bos><start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
<eos>`
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        `<bos><start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
<start_of_turn>model
`
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        `<bos><start_of_turn>user
System prompt.

Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
<start_of_turn>model
`
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, {
        templateKey: 'gemmaIt',
        ...config
      });
      expect(result).toBe(expected);
    });
  });

  describe('Gemmasutra Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        `<bos><start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
`
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        `<bos><start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
`
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        `<bos><start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
<eos>`
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        `<bos><start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
<start_of_turn>model
`
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        `<bos><start_of_turn>system
System prompt.<end_of_turn>
<start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
<start_of_turn>model
`
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, {
        templateKey: 'gemmasutra',
        ...config
      });
      expect(result).toBe(expected);
    });
  });

  describe('Danube-2 Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        '<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s>'
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        '<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s>'
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        '<s><|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s>'
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        '<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s><|answer|>'
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        'System prompt.</s><|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s><|answer|>'
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, {
        templateKey: 'danube2',
        ...config
      });
      expect(result).toBe(expected);
    });
  });

  describe('Danube-3 Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        '<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s>'
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        '<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s>'
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        '<s><|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s>'
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        '<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s><|answer|>'
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        'System prompt.</s><|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s><|answer|>'
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, {
        templateKey: 'danube3',
        ...config
      });
      expect(result).toBe(expected);
    });
  });

  describe('Qwen2 Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        `<|im_start|>system
You are a helpful assistant<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        `<|im_start|>system
You are a helpful assistant<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        `<|im_start|>system
You are a helpful assistant<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|endoftext|>`
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        `<|im_start|>system
You are a helpful assistant<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        `<|im_start|>system
System prompt.<|im_end|>
<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const result = applyTemplate(conversation, {
        templateKey: 'qwen2',
        ...config
      });
      expect(result).toBe(expected);
    });
  });

  describe('Custom Template', () => {
    it.each([
      [
        'default',
        baseConversation,
        {},
        `<|text_start|><|im_s|>system
You are a helpful assistant.<|im_e|>
<|im_s|>user
Hi there!<|im_e|>
<|im_s|>assistant
Nice to meet you!<|im_e|>
<|im_s|>user
Can I ask a question?<|im_e|>
`
      ],
      [
        'without generation/BOS/EOS',
        baseConversation,
        {
          addGenerationPrompt: false,
          isBeginningOfSequence: false,
          isEndOfSequence: false
        },
        `<|im_s|>system
You are a helpful assistant.<|im_e|>
<|im_s|>user
Hi there!<|im_e|>
<|im_s|>assistant
Nice to meet you!<|im_e|>
<|im_s|>user
Can I ask a question?<|im_e|>
`
      ],
      [
        'without generation prompt and with eos and bos',
        baseConversation,
        { isEndOfSequence: true, isBeginningOfSequence: true },
        `<|text_start|><|im_s|>system
You are a helpful assistant.<|im_e|>
<|im_s|>user
Hi there!<|im_e|>
<|im_s|>assistant
Nice to meet you!<|im_e|>
<|im_s|>user
Can I ask a question?<|im_e|>
<|text_end|>`
      ],
      [
        'with generation prompt',
        baseConversation,
        { addGenerationPrompt: true },
        `<|text_start|><|im_s|>system
You are a helpful assistant.<|im_e|>
<|im_s|>user
Hi there!<|im_e|>
<|im_s|>assistant
Nice to meet you!<|im_e|>
<|im_s|>user
Can I ask a question?<|im_e|>
<|im_s|>assistant
`
      ],
      [
        'with system prompt with generation prompt',
        conversationWithSystem,
        { addGenerationPrompt: true },
        `<|text_start|><|im_s|>system
System prompt.<|im_e|>
<|im_s|>user
Hi there!<|im_e|>
<|im_s|>assistant
Nice to meet you!<|im_e|>
<|im_s|>user
Can I ask a question?<|im_e|>
<|im_s|>assistant
`
      ]
    ])('should render %s', (_, conversation, config, expected) => {
      const template: TemplateConfig = {
        bosToken: '<|text_start|>',
        eosToken: '<|text_end|>',
        addBosToken: true,
        addEosToken: false,
        chatTemplate:
          "{% for message in messages %}{% if loop.first and messages[0]['role'] != 'system' %}{{ '<|im_s|>system\nYou are a helpful assistant.<|im_e|>\n' }}{% endif %}{{'<|im_s|>' + message['role'] + '\n' + message['content'] + '<|im_e|>' + '\n'}}{% endfor %}{% if add_generation_prompt %}{{ '<|im_s|>assistant\n' }}{% endif %}"
      };
      const result = applyTemplate(conversation, {
        customTemplate: template,
        ...config
      });
      expect(result).toBe(expected);
    });
  });
});
