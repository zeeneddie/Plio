import { curry } from 'ramda';
import { isDueToday } from '../../helpers';

export default curry((timezone, { verificationTargetDate }) =>
  isDueToday(verificationTargetDate, timezone));
