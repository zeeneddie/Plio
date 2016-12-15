/* eslint-disable no-param-reassign */

import { combineReducers } from 'redux';
import { ORGANIZATION_CHANGED, USER_LOGOUT } from '../actions/types';

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
import helpDocs from './helpDocsReducer';

const appReducer = combineReducers({
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
  helpDocs,
});

const rootReducer = (state, action) => {
  // reset the state if the user changes organization or logs out
  if (action.type === ORGANIZATION_CHANGED || action.type === USER_LOGOUT) {
    state = undefined;
  }

  return appReducer(state, action);
};


export default rootReducer;
