import { createRedirectHandler } from './helpers';

import { paths } from './paths';

const actions = Object.keys(paths).reduce((prev, pathName) => ({
  ...prev,
  [pathName]: createRedirectHandler(paths[pathName]),
}), {});

export const goTo = name => actions[name];
