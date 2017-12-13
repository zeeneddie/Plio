import { view } from 'ramda';

import { lenses } from '../../../util';

export const getMobileShowCard = view(lenses.mobile.showCard);
