import moment from 'moment-timezone';

import { ActionUndoTimeInHours } from '../../../share/constants';

export default (date) => {
  const undoDeadline = moment(date).add(ActionUndoTimeInHours, 'hours');

  return undoDeadline.isAfter(new Date());
};
