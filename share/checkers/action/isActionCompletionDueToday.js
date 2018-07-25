import { curry } from 'ramda';
import { isDueToday } from '../../helpers';

export default curry((timezone, { completionTargetDate }) =>
  isDueToday(completionTargetDate, timezone));
