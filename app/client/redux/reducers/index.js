/* eslint-disable no-param-reassign */

import { combineReducers } from 'redux';
import { ORGANIZATION_CHANGED } from '../actions/types';

import discussion from './discussionReducer';
import standards from './standardsReducer';
import organizations from './organizationsReducer';
import changelog from './changelogReducer';
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
  collections,
  window,
  mobile,
  counters,
  global,
  helpDocs,
});

const rootReducer = (state, action) => {
  // reset the state if the user changes organization
  if (action.type === ORGANIZATION_CHANGED) {
    state = undefined;
  }

  return appReducer(state, action);
};


export default rootReducer;
