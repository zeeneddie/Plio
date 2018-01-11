import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getWindowWidth = view(lenses.window.width);
