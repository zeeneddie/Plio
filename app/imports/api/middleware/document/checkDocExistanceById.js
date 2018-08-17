import { prop, objOf, compose } from 'ramda';
import checkDocExistance from './checkDocExistance';

export default checkDocExistance(compose(objOf('_id'), prop('_id')));
