import { pick } from 'ramda';
import checkDocExistance from './checkDocExistance';

export default checkDocExistance(pick(['_id']));
