import { getCursorOfNonDeletedWithFields } from '../helpers';
import { Standards } from './standards';

export const getStandardCursorByIds = (fields) => ({ standardsIds:_id }) =>
  getCursorOfNonDeletedWithFields({ _id }, fields, Standards);
