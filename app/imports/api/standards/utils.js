import { getCursorNonDeleted } from '../helpers';
import { Standards } from '/imports/share/collections/standards';

export const getStandardsCursorByIds = fields => ({ standardsIds: _id }) =>
  getCursorNonDeleted({ _id }, fields, Standards);
