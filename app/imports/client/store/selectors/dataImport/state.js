import { view } from 'ramda';
import { lenses } from '../../../../client/util';

export const getIsModalOpened = view(lenses.dataImport.isModalOpened);

export const getIsInProgress = view(lenses.dataImport.isInProgress);
