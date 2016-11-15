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
  SET_CHANGELOG_DOCUMENT,
  SET_SHOW_ALL,
  SET_CHANGELOG_DOCUMENT_DATA,
} from './types';

export const setLoadingLastHumanLog = (value) => {
  return {
    type: SET_LOADING_LAST_HUMAN_LOG,
    payload: value,
  };
};

export const setLoadingLastLogs = (value) => {
  return {
    type: SET_LOADING_LAST_LOGS,
    payload: value,
  };
};

export const setLastLogsLoaded = (value) => {
  return {
    type: SET_LAST_LOGS_LOADED,
    payload: value,
  };
};

export const setLoadingAllLogs = (value) => {
  return {
    type: SET_LOADING_ALL_LOGS,
    payload: value,
  };
};

export const setAllLogsLoaded = (value) => {
  return {
    type: SET_ALL_LOGS_LOADED,
    payload: value,
  };
};

export const setLoadingLogsCount = (value) => {
  return {
    type: SET_LOADING_LOGS_COUNT,
    payload: value,
  };
};

export const setLogsCount = (count) => {
  return {
    type: SET_LOGS_COUNT,
    payload: count,
  };
};

export const setChangelogCollapsed = (value) => {
  return {
    type: SET_CHANGELOG_COLLAPSED,
    payload: value,
  };
};

export const setLogs = (logs) => {
  return {
    type: SET_LOGS,
    payload: logs,
  };
};

export const setLastHumanLog = (log) => {
  return {
    type: SET_LAST_HUMAN_LOG,
    payload: log,
  };
};

export const setChangelogDocument = (doc) => {
  return {
    type: SET_CHANGELOG_DOCUMENT,
    payload: doc,
  };
};

export const setShowAll = (value) => {
  return {
    type: SET_SHOW_ALL,
    payload: value,
  };
};

export const setChangelogDocumentData = (docData) => {
  return {
    type: SET_CHANGELOG_DOCUMENT_DATA,
    payload: docData,
  };
};
