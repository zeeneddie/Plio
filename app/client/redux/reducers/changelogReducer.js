import {
  SET_LOADING_LAST_HUMAN_LOG,
  SET_LAST_HUMAN_LOG_LOADED,
  SET_LOADING_LAST_LOGS,
  SET_LAST_LOGS_LOADED,
  SET_LOADING_ALL_LOGS,
  SET_ALL_LOGS_LOADED,
  SET_LOADING_LOGS_COUNT,
  SET_LOGS_COUNT_LOADED,
  SET_LOGS_COUNT,
  SET_CHANGELOG_COLLAPSED,
  SET_LOGS,
  SET_LAST_HUMAN_LOG,
  SET_CHANGELOG_DOCUMENT_ID,
  SET_CHANGELOG_DOCUMENT_COLLECTION,
  SET_CHANGELOG_DOCUMENT,
  SET_SHOW_ALL,
} from '../actions/types';

export const initialState = {
  isLoadingLastHumanLog: false,
  isLastHumanLogLoaded: false,
  isLoadingLastLogs: false,
  isLastLogsLoaded: false,
  isLoadingAllLogs: false,
  isAllLogsLoaded: false,
  isLoadingLogsCount: false,
  isLogsCountLoaded: false,
  logsCount: 0,
  isChangelogCollapsed: true,
  logs: [],
  lastHumanLog: null,
  changelogDocumentId: '',
  changelogDocumentCollection: '',
  changelogDocument: null,
  showAll: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_LAST_HUMAN_LOG:
      return { ...state, isLoadingLastHumanLog: action.payload };
    case SET_LAST_HUMAN_LOG_LOADED:
      return { ...state, isLastHumanLogLoaded: action.payload };
    case SET_LOADING_LAST_LOGS:
      return { ...state, isLoadingLastLogs: action.payload };
    case SET_LAST_LOGS_LOADED:
      return { ...state, isLastLogsLoaded: action.payload };
    case SET_LOADING_ALL_LOGS:
      return { ...state, isLoadingAllLogs: action.payload };
    case SET_ALL_LOGS_LOADED:
      return { ...state, isAllLogsLoaded: action.payload };
    case SET_LOADING_LOGS_COUNT:
      return { ...state, isLoadingLogsCount: action.payload };
    case SET_LOGS_COUNT_LOADED:
      return { ...state, isLogsCountLoaded: action.payload };
    case SET_LOGS_COUNT:
      return { ...state, logsCount: action.payload };
    case SET_CHANGELOG_COLLAPSED:
      return { ...state, isChangelogCollapsed: action.payload };
    case SET_LOGS:
      return { ...state, logs: action.payload };
    case SET_LAST_HUMAN_LOG:
      return { ...state, lastHumanLog: action.payload };
    case SET_CHANGELOG_DOCUMENT_ID:
      return { ...state, changelogDocumentId: action.payload };
    case SET_CHANGELOG_DOCUMENT_COLLECTION:
      return { ...state, changelogDocumentCollection: action.payload };
    case SET_CHANGELOG_DOCUMENT:
      return { ...state, changelogDocument: action.payload };
    case SET_SHOW_ALL:
      return { ...state, showAll: action.payload };
    default:
      return state;
  }
}
