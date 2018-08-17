import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { withCurrentTime } from '../helpers';
import { ActionUndoTimeInHours } from '../../../share/constants';

const UndoTime = ({
  date,
  currentTime,
  threshold = ActionUndoTimeInHours,
  children = ({ passed, left }) => `${passed} passed, ${left} left to undo`,
}) => {
  const undoDeadline = moment(date).add(threshold, 'hours');
  const passed = moment(date).from(currentTime);
  const left = moment(undoDeadline).to(currentTime, true);
  const isOverdue = undoDeadline.isBefore(currentTime);

  return children({ passed, left, isOverdue });
};

UndoTime.propTypes = {
  date: PropTypes.any.isRequired,
  children: PropTypes.func.isRequired,
};

export default withCurrentTime()(UndoTime);
