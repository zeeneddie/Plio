import { view } from 'ramda';
import { lenses } from '../../../../client/util';

export const getIsModalOpened = view(lenses.dataImport.isModalOpened);
