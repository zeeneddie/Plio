import checkDocAccess from './checkDocAccess';
import { Goals } from '../../collections';

export default (...args) => checkDocAccess(Goals, ...args);
