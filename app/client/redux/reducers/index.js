import { combineReducers } from 'redux';

import discussion from './discussionReducer';
import standards from './standardsReducer';
import organizations from './organizationsReducer';
import changelog from './changelogReducer';
import customers from './customersReducer';
import global from './globalReducer';
import collections from './collectionsReducer';
import window from './windowReducer';
import mobile from './mobileReducer';
import counters from './countersReducer';

export default combineReducers({
  discussion,
  standards,
  organizations,
  changelog,
  customers,
  collections,
  window,
  mobile,
  counters,
  global,
});
