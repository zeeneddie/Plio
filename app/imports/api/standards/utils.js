import { getCursorOfNonDeletedWithFields } from '../helpers';
import { Standards } from '/imports/share/collections/standards';

export const getStandardCursorByIds = (fields) => ({ standardsIds:_id }) =>
  getCursorOfNonDeletedWithFields({ _id }, fields, Standards);
