import { view } from 'ramda';
import lenses from '../lenses';

export const getIsModalOpened = view(lenses.dataImport.isModalOpened);
