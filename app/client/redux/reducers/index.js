import { combineReducers } from 'redux';

import discussion from './discussionReducer';
import standards from './standardsReducer';
import organizations from './organizationsReducer';
import global from './globalReducer';
import collections from './collectionsReducer';
import window from './windowReducer';
import mobile from './mobileReducer';

export default combineReducers({
  discussion,
  standards,
  organizations,
  global,
  collections,
  window,
  mobile,
});
