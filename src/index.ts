import applyTemplate from './core/applyTemplate';
import { Conversation, Message } from './types/conversation';

export {
  applyTemplate,
  Conversation,
  Message
};

// export templates (in case users want to customize) 
import * as Templates from './templates';
export { Templates };