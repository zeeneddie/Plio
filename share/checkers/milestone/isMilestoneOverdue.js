import { curry } from 'ramda';
import { isOverdue } from '../../helpers';

export default curry((timezone, { completionTargetDate }) =>
  isOverdue(completionTargetDate, timezone));
