import { curry } from 'ramda';
import { isOverdue } from '../../helpers';

export default curry((timezone, { endDate }) => isOverdue(endDate, timezone));
