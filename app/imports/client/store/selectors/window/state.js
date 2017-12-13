import { view } from 'ramda';

import { lenses } from '../../../util';

export const getWindowWidth = view(lenses.window.width);
