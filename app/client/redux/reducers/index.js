import { combineReducers } from 'redux';

import discussion from './discussionReducer';
import standards from './standardsReducer';
import organizations from './organizationsReducer';
import global from './globalReducer';
import collections from './collectionsReducer';

export default combineReducers({
  discussion,
  standards,
  organizations,
  global,
  collections,
});
