import { view } from 'ramda';

import lenses from '../lenses';


export const getUsersByIds = view(lenses.collections.usersByIds);
