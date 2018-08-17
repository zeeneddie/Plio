import { curry } from 'ramda';
import { isOverdue } from '../../helpers';

export default curry((timezone, { verificationTargetDate }) =>
  isOverdue(verificationTargetDate, timezone));
