import { FlowRouter } from 'meteor/kadira:flow-router';

const getOrgSerialNumber = ({ orgSerialNumber } = {}) =>
  orgSerialNumber || FlowRouter.getParam('orgSerialNumber');
const getFilter = ({ filter } = {}) =>
  filter || FlowRouter.getQueryParam('filter') || 1;

export const goToDashboard = (params = {}) => {
  const orgSerialNumber = getOrgSerialNumber(params);

  FlowRouter.withReplaceState(() => FlowRouter.go('dashboardPage', { orgSerialNumber }));
};

const createPathGetter = path => (params, queryParams) => {
  const orgSerialNumber = getOrgSerialNumber(params);
  const urlItemId = params.urlItemId;
  const _params = { ...params, orgSerialNumber, urlItemId };
  const filter = getFilter(queryParams);
  const _queryParams = queryParams || { filter };

  return FlowRouter.path(path, _params, _queryParams);
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
  const orgSerialNumber = getOrgSerialNumber(params);
  const urlItemId = params.urlItemId;
  const _params = { ...params, orgSerialNumber, urlItemId };
  const filter = getFilter(queryParams);
  const _queryParams = queryParams || { filter };

  return FlowRouter.withReplaceState(() =>
    FlowRouter.go('standard', _params, _queryParams));
};

export const getPathToDiscussion = createPathGetter('standardDiscussion');

export const getPathToNC = createPathGetter('nonconformity');

export const getPathToRisk = createPathGetter('risk');

export const getPathToWorkItem = createPathGetter('workInboxItem');
