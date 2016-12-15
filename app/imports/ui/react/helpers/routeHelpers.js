import { FlowRouter } from 'meteor/kadira:flow-router';

const getOrgSerialNumber = ({ orgSerialNumber } = {}) =>
  orgSerialNumber || FlowRouter.getParam('orgSerialNumber');
const getFilter = ({ filter } = {}) =>
  filter || FlowRouter.getQueryParam('filter') || 1;

const createPathGetter = (path, urlItemIdParamName = 'urlItemId') => (params, queryParams) => {
  const orgSerialNumber = getOrgSerialNumber(params);
  const _params = { ...params, orgSerialNumber, [urlItemIdParamName]: params.urlItemId };
  const filter = getFilter(queryParams);
  const _queryParams = queryParams || { filter };

  return FlowRouter.path(path, _params, _queryParams);
};

export const getPathToStandard = createPathGetter('standard');

export const getPathToDiscussion = createPathGetter('standardDiscussion');

export const getPathToNC = createPathGetter('nonconformity');

export const getPathToRisk = createPathGetter('risk', 'riskId');

export const getPathToWorkItem = createPathGetter('workInboxItem', 'workItemId');

export const goToDashboard = (params = {}) => {
  const orgSerialNumber = getOrgSerialNumber(params);

  FlowRouter.withReplaceState(() => FlowRouter.go('dashboardPage', { orgSerialNumber }));
};

export const goToStandards = (params, queryParams) => {
  const orgSerialNumber = getOrgSerialNumber(params);
  const filter = getFilter(queryParams);
  const _params = { ...params, orgSerialNumber };
  const _queryParams = queryParams || { filter };

  return FlowRouter.withReplaceState(() =>
    FlowRouter.go('standards', _params, _queryParams));
};

export const goToStandard = (params, queryParams) => {
  const path = getPathToStandard(params, queryParams);

  return FlowRouter.withReplaceState(() => FlowRouter.go(path));
};
