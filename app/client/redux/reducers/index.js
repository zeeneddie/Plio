import { combineReducers } from 'redux';

import discussion from './discussionReducer';
import standards from './standardsReducer';
import organizations from './organizationsReducer';

export default combineReducers({
  discussion,
  standards,
  organizations
});
