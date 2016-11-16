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

export const setLoadingLastHumanLog = (isLoadingLastHumanLog) => {
  return {
    type: SET_LOADING_LAST_HUMAN_LOG,
    payload: { isLoadingLastHumanLog },
  };
};

export const setLoadingLastLogs = (isLoadingLastLogs) => {
  return {
    type: SET_LOADING_LAST_LOGS,
    payload: { isLoadingLastLogs },
  };
};

export const setLastLogsLoaded = (isLastLogsLoaded) => {
  return {
    type: SET_LAST_LOGS_LOADED,
    payload: { isLastLogsLoaded },
  };
};

export const setLoadingAllLogs = (isLoadingAllLogs) => {
  return {
    type: SET_LOADING_ALL_LOGS,
    payload: { isLoadingAllLogs },
  };
};

export const setAllLogsLoaded = (isAllLogsLoaded) => {
  return {
    type: SET_ALL_LOGS_LOADED,
    payload: { isAllLogsLoaded },
  };
};

export const setLoadingLogsCount = (isLoadingLogsCount) => {
  return {
    type: SET_LOADING_LOGS_COUNT,
    payload: { isLoadingLogsCount },
  };
};

export const setLogsCount = (logsCount) => {
  return {
    type: SET_LOGS_COUNT,
    payload: { logsCount },
  };
};

export const setChangelogCollapsed = (isChangelogCollapsed) => {
  return {
    type: SET_CHANGELOG_COLLAPSED,
    payload: { isChangelogCollapsed },
  };
};

export const setLogs = (logs) => {
  return {
    type: SET_LOGS,
    payload: { logs },
  };
};

export const setLastHumanLog = (lastHumanLog) => {
  return {
    type: SET_LAST_HUMAN_LOG,
    payload: { lastHumanLog },
  };
};

export const setChangelogDocument = (changelogDocument) => {
  return {
    type: SET_CHANGELOG_DOCUMENT,
    payload: { changelogDocument },
  };
};

export const setShowAll = (showAll) => {
  return {
    type: SET_SHOW_ALL,
    payload: { showAll },
  };
};

export const setChangelogDocumentData = ({ documentId, collection }) => {
  return {
    type: SET_CHANGELOG_DOCUMENT_DATA,
    payload: { documentId, collection },
  };
};
