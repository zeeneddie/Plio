import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getMobileShowCard = view(lenses.mobile.showCard);
