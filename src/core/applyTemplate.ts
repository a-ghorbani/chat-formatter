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

const applyTemplate = (
  conversation: Conversation | Conversation[],
  options: ApplyTemplateOptions = {}
): string | string[] => {
  const {
    templateKey = 'default',
    customTemplate,
    addGenerationPrompt = false,
    isBeginningOfSequence,
    isEndOfSequence
  } = options;

  const nunjucksEnv = setupNunjucksEnvironment();

  // If both templateKey and customTemplate are provided, customTemplate takes precedence.
  const template: TemplateConfig = customTemplate ?? templates[templateKey];
  const templateString = template.chatTemplate;

  const renderTemplate = (chat: Conversation): string => {
    let result = nunjucksEnv.renderString(templateString, {
      messages: chat,
      add_generation_prompt: addGenerationPrompt,
      bos_token: template.bosToken,
      eos_token: template.eosToken
    });

    const shouldAddBosToken =
      isBeginningOfSequence !== undefined
        ? isBeginningOfSequence
        : template.addBosToken;

    const shouldAddEosToken =
      isEndOfSequence !== undefined ? isEndOfSequence : template.addEosToken;

    if (shouldAddBosToken && template.bosToken) {
      if (!result.startsWith(template.bosToken)) {
        result = template.bosToken + result;
      }
    }

    if (shouldAddEosToken && template.eosToken) {
      if (!result.endsWith(template.eosToken)) {
        result += template.eosToken;
      }
    }

    return result;
  };

  if (Array.isArray(conversation[0])) {
    return (conversation as Conversation[]).map(renderTemplate);
  } else {
    return renderTemplate(conversation as Conversation);
  }
};

export default applyTemplate;
