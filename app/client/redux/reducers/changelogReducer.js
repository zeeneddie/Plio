import {
  SET_LOADING_LAST_HUMAN_LOG,
  SET_LOADING_LAST_LOGS,
  SET_LAST_LOGS_LOADED,
  SET_LOADING_ALL_LOGS,
  SET_ALL_LOGS_LOADED,
  SET_LOADING_LOGS_COUNT,
  SET_LOGS_COUNT,
  SET_CHANGELOG_COLLAPSED,
  SET_LOGS,
  SET_LAST_HUMAN_LOG,
  SET_CHANGELOG_DOCUMENT_DATA,
  SET_CHANGELOG_DOCUMENT,
  SET_SHOW_ALL,
} from '../actions/types';

export const initialState = {
  isLoadingLastHumanLog: false,
  isLoadingLastLogs: false,
  isLastLogsLoaded: false,
  isLoadingAllLogs: false,
  isAllLogsLoaded: false,
  isLoadingLogsCount: false,
  logsCount: null,
  isChangelogCollapsed: true,
  logs: [],
  lastHumanLog: null,
  documentId: '',
  collection: '',
  changelogDocument: null,
  showAll: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_LAST_HUMAN_LOG:
    case SET_LOADING_LAST_LOGS:
    case SET_LAST_LOGS_LOADED:
    case SET_LOADING_ALL_LOGS:
    case SET_ALL_LOGS_LOADED:
    case SET_LOADING_LOGS_COUNT:
    case SET_LOGS_COUNT:
    case SET_CHANGELOG_COLLAPSED:
    case SET_LOGS:
    case SET_LAST_HUMAN_LOG:
    case SET_CHANGELOG_DOCUMENT:
    case SET_SHOW_ALL:
      return { ...state, ...action.payload };
    case SET_CHANGELOG_DOCUMENT_DATA:
      return { ...initialState, ...action.payload };
    default:
      return state;
  }
}
