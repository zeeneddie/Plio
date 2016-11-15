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
  changelogDocumentId: '',
  changelogDocumentCollection: '',
  changelogDocument: null,
  showAll: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_LAST_HUMAN_LOG:
      return { ...state, isLoadingLastHumanLog: action.payload };
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
    case SET_LOGS_COUNT:
      return { ...state, logsCount: action.payload };
    case SET_CHANGELOG_COLLAPSED:
      return { ...state, isChangelogCollapsed: action.payload };
    case SET_LOGS:
      return { ...state, logs: action.payload };
    case SET_LAST_HUMAN_LOG:
      return { ...state, lastHumanLog: action.payload };
    case SET_CHANGELOG_DOCUMENT_DATA:
      return {
        ...initialState,
        changelogDocumentId: action.payload.documentId,
        changelogDocumentCollection: action.payload.collection,
      };
    case SET_CHANGELOG_DOCUMENT:
      return { ...state, changelogDocument: action.payload };
    case SET_SHOW_ALL:
      return { ...state, showAll: action.payload };
    default:
      return state;
  }
}
