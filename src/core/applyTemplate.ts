import nunjucks from 'nunjucks';
import { Conversation } from '../types/conversation';
import { templates } from '../templates';
import { setupNunjucksEnvironment } from '../utils/nunjucksEnvironment';
import { TemplateConfig } from '../types';

interface ApplyTemplateOptions {
  templateKey?: string;
  customTemplate?: TemplateConfig;
  addGenerationPrompt?: boolean;
  isBeginningOfSequence?: boolean;
  isEndOfSequence?: boolean;
}

const applyTemplate = async (
  conversation: Conversation | Conversation[],
  options: ApplyTemplateOptions = {}
): Promise<string | string[]> => {
  const {
    templateKey = 'default',
    customTemplate,
    addGenerationPrompt = false,
    isBeginningOfSequence = true,
    isEndOfSequence = true
  } = options;

  setupNunjucksEnvironment();

  // If both templateKey and customTemplate are provided, customTemplate takes precedence.
  const template: TemplateConfig = customTemplate ?? templates[templateKey];
  const templateString = template.chatTemplate;

  const renderTemplate = (chat: Conversation): string =>
    nunjucks.renderString(templateString, {
      messages: chat,
      add_generation_prompt: addGenerationPrompt,
      bos_token: isBeginningOfSequence ? template.bosToken : '',
      eos_token: isEndOfSequence ? template.eosToken : ''
    });

  if (Array.isArray(conversation[0])) {
    return Promise.all((conversation as Conversation[]).map(renderTemplate));
  } else {
    return renderTemplate(conversation as Conversation);
  }
};

export default applyTemplate;
