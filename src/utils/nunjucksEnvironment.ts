import nunjucks from 'nunjucks';

export function setupNunjucksEnvironment(): nunjucks.Environment {
  const env = nunjucks.configure({ autoescape: false });
  env.addGlobal('raise_exception', (message: string) => {
    throw new Error(message);
  });

  return env;
}
