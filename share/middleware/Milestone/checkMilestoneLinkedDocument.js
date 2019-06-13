import checkGoalAccess from '../Goal/checkGoalAccess';
import Errors from '../../errors';

export default () => checkGoalAccess((root, { linkedTo }) => ({
  errorMessage: Errors.LINKED_DOC_NOT_FOUND,
  query: { _id: linkedTo },
}));
