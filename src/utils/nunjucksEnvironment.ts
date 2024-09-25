import nunjucks from 'nunjucks';
import { strftime } from './utils';

export function setupNunjucksEnvironment(): nunjucks.Environment {
  const env = new nunjucks.Environment(null, { autoescape: false });

  env.addGlobal('raise_exception', (message: string) => {
    throw new Error(`${message}`);
  });

  env.addGlobal('strftime_now', (format: string) => {
    const now = new Date();
    return strftime(now, format);
  });

  return env;
}
