// tests/applyTemplate.test.ts

import applyTemplate from '../src/core/applyTemplate';
import { Conversation } from '../src/types/conversation';

describe('Template Rendering Tests', () => {
  describe('Default template tests', () => {
    const conversation: Conversation = [
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    it('should render default without generation prompt', async () => {
      const result = await applyTemplate(conversation, {});
      console.log('result: ', result);
      expect(result).toBe(
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      );
    });

    it('should render default with generation prompt', async () => {
      const result = await applyTemplate(conversation, {
        addGenerationPrompt: true
      });
      console.log('result: ', result);
      expect(result).toBe(
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
<|im_start|>assistant
`
      );
    });
  });

  describe('chatMLTemplate Tests', () => {
    const conversation: Conversation = [
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    const conversationWSystem = [
      { role: 'system', content: 'System prompt.' },
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    it('should render chatMLTemplate without generation prompt', async () => {
      const result = await applyTemplate(conversation, {
        templateKey: 'chatML'
      });
      expect(result).toBe(
        `<|im_start|>user
Hi there!<|im_end|>
<|im_start|>assistant
Nice to meet you!<|im_end|>
<|im_start|>user
Can I ask a question?<|im_end|>
`
      );
    });

    it('should render chatMLTemplate with generation prompt', async () => {
      const result = await applyTemplate(conversationWSystem, {
        templateKey: 'chatML',
        addGenerationPrompt: true
      });
      expect(result).toBe(
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
      );
    });

    it('should throw an error for incorrect role sequence', async () => {
      const badConversation: Conversation = [
        { role: 'user', content: 'Hi!' },
        { role: 'user', content: 'Still there?' } // Incorrect sequence
      ];

      await expect(
        applyTemplate(badConversation, { templateKey: 'chatML' })
      ).rejects.toThrow(
        'Conversation roles must alternate user/assistant/user/assistant/...'
      );
    });
  });

  describe('Llama-3 Tests', () => {
    const conversation: Conversation = [
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    const conversationWSystem = [
      { role: 'system', content: 'System prompt.' },
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    it('Should render Llama-3 template without generation prompt', async () => {
      const result = await applyTemplate(conversation, {
        templateKey: 'llama3'
      });
      expect(result).toBe(
        `<|begin_of_text|><|start_header_id|>user<|end_header_id|>

Hi there!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Nice to meet you!<|eot_id|><|start_header_id|>user<|end_header_id|>

Can I ask a question?<|eot_id|>`
      );
    });

    it('Should render Llama-3 template with generation prompt', async () => {
      const result = await applyTemplate(conversationWSystem, {
        templateKey: 'llama3',
        addGenerationPrompt: true
      });
      console.log('result: ', result);
      expect(result).toBe(
        `<|begin_of_text|><|start_header_id|>system<|end_header_id|>

System prompt.<|eot_id|><|start_header_id|>user<|end_header_id|>

Hi there!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

Nice to meet you!<|eot_id|><|start_header_id|>user<|end_header_id|>

Can I ask a question?<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`
      );
    });
  });

  describe('Phi-3 Tests', () => {
    const conversation: Conversation = [
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    const conversationWSystem = [
      { role: 'system', content: 'System prompt.' },
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    it('Should render Phi-3 template without generation prompt', async () => {
      const result = await applyTemplate(conversation, {
        templateKey: 'phi3'
      });
      console.log('result: ', result);
      expect(result).toBe(
        `<s><|user|>
Hi there!<|end|>
<|assistant|>
Nice to meet you!<|end|>
<|user|>
Can I ask a question?<|end|>
`
      );
    });

    it('Should render Phi-3 template with generation prompt', async () => {
      const result = await applyTemplate(conversationWSystem, {
        templateKey: 'phi3',
        addGenerationPrompt: true
      });
      console.log('result: ', result);
      expect(result).toBe(
        `<s><|system|>
System prompt.<|end|>
<|user|>
Hi there!<|end|>
<|assistant|>
Nice to meet you!<|end|>
<|user|>
Can I ask a question?<|end|>
<|assistant|>
`
      );
    });
  });

  describe('Gemma-it Tests', () => {
    const conversation: Conversation = [
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    const conversationWSystem = [
      { role: 'system', content: 'System prompt.' },
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    it('Should render Gemma-it template without generation prompt', async () => {
      const result = await applyTemplate(conversation, {
        templateKey: 'gemmaIt'
      });
      console.log('result: ', result);
      expect(result).toBe(
        `<start_of_turn>user
Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
`
      );
    });

    it('Should render Gemma-it template with generation prompt', async () => {
      const result = await applyTemplate(conversationWSystem, {
        templateKey: 'gemmaIt',
        addGenerationPrompt: true
      });
      console.log('result: ', result);
      expect(result).toBe(
        `<start_of_turn>user
System prompt.

Hi there!<end_of_turn>
<start_of_turn>model
Nice to meet you!<end_of_turn>
<start_of_turn>user
Can I ask a question?<end_of_turn>
<start_of_turn>model
`
      );
    });
  });

  describe('Danue-2 Tests', () => {
    const conversation: Conversation = [
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    const conversationWSystem = [
      { role: 'system', content: 'System prompt.' },
      { role: 'user', content: 'Hi there!' },
      { role: 'assistant', content: 'Nice to meet you!' },
      { role: 'user', content: 'Can I ask a question?' }
    ];

    it('Should render Danube-2 template without generation prompt', async () => {
      const result = await applyTemplate(conversation, {
        templateKey: 'danube2',
        addGenerationPrompt: true
      });
      console.log('result: ', result);
      expect(result).toBe(
        '<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s><|answer|>'
      );
    });

    it('Should render Danube-2 template with generation prompt', async () => {
      const result = await applyTemplate(conversationWSystem, {
        templateKey: 'danube2',
        addGenerationPrompt: true
      });
      console.log('result: ', result);
      expect(result).toBe(
        'System prompt.<|prompt|>Hi there!</s><|answer|>Nice to meet you!</s><|prompt|>Can I ask a question?</s><|answer|>'
      );
    });
  });
});
