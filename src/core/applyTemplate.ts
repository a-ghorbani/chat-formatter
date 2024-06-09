import nunjucks from 'nunjucks';
import { Conversation } from '../types/conversation';
import { templates } from '../templates';
import { setupNunjucksEnvironment } from '../utils/nunjucksEnvironment';

interface ApplyTemplateOptions {
  templateKey?: string;
   addGenerationPrompt?: boolean;
  isBeginningOfSequence?: boolean;
  isEndOfSequence?: boolean;
}

const applyTemplate = async (
  conversation: Conversation | Conversation[],
  options: ApplyTemplateOptions = {},
): Promise<string | string[]> => {
  const {
    templateKey = 'default',
    addGenerationPrompt = false,
    isBeginningOfSequence = true,
    isEndOfSequence = true,
  } = options;

  const env = setupNunjucksEnvironment();
   const template = templates[templateKey];
   const templateString = template.chatTemplate;

  const renderTemplate = (chat: Conversation): string =>
    nunjucks.renderString(templateString, {
      messages: chat,
      add_generation_prompt: addGenerationPrompt,
      bos_token: isBeginningOfSequence ? template.bosToken : '',
      eos_token: isEndOfSequence ? template.eosToken : '',
    });

  if (Array.isArray(conversation[0])) {
    return Promise.all((conversation as Conversation[]).map(renderTemplate));
  } else {
    return renderTemplate(conversation as Conversation);
  }
};

export default applyTemplate;
