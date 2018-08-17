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

export const setLoadingLastHumanLog = isLoadingLastHumanLog => ({
  type: SET_LOADING_LAST_HUMAN_LOG,
  payload: { isLoadingLastHumanLog },
});

export const setLoadingLastLogs = isLoadingLastLogs => ({
  type: SET_LOADING_LAST_LOGS,
  payload: { isLoadingLastLogs },
});

export const setLastLogsLoaded = isLastLogsLoaded => ({
  type: SET_LAST_LOGS_LOADED,
  payload: { isLastLogsLoaded },
});

export const setLoadingAllLogs = isLoadingAllLogs => ({
  type: SET_LOADING_ALL_LOGS,
  payload: { isLoadingAllLogs },
});

export const setAllLogsLoaded = isAllLogsLoaded => ({
  type: SET_ALL_LOGS_LOADED,
  payload: { isAllLogsLoaded },
});

export const setLoadingLogsCount = isLoadingLogsCount => ({
  type: SET_LOADING_LOGS_COUNT,
  payload: { isLoadingLogsCount },
});

export const setLogsCount = logsCount => ({
  type: SET_LOGS_COUNT,
  payload: { logsCount },
});

export const setChangelogCollapsed = isChangelogCollapsed => ({
  type: SET_CHANGELOG_COLLAPSED,
  payload: { isChangelogCollapsed },
});

export const setLogs = logs => ({
  type: SET_LOGS,
  payload: { logs },
});

export const setLastHumanLog = lastHumanLog => ({
  type: SET_LAST_HUMAN_LOG,
  payload: { lastHumanLog },
});

export const setChangelogDocument = changelogDocument => ({
  type: SET_CHANGELOG_DOCUMENT,
  payload: { changelogDocument },
});

export const setShowAll = showAll => ({
  type: SET_SHOW_ALL,
  payload: { showAll },
});

export const setChangelogDocumentData = ({ documentId, collection }) => ({
  type: SET_CHANGELOG_DOCUMENT_DATA,
  payload: { documentId, collection },
});
