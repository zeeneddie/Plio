import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import { withCurrentTime } from '../helpers';
import { ActionUndoTimeInHours } from '../../../share/constants';

const UndoTime = ({
  date,
  currentTime,
  render = ({ passed, left }) => `${passed} passed, ${left} left to undo`,
}) => {
  const undoDeadline = new Date(date);
  undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);

  const passed = moment(date).from(currentTime);
  const left = moment(undoDeadline).to(currentTime, true);

  return render({ passed, left });
};

UndoTime.propTypes = {
  date: PropTypes.oneOfType([PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
  render: PropTypes.func,
};

export default withCurrentTime()(UndoTime);
