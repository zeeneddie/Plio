import { view } from 'ramda';
import { lenses } from 'plio-util';

export const getIsModalOpened = view(lenses.dataImport.isModalOpened);

export const getIsInProgress = view(lenses.dataImport.isInProgress);
