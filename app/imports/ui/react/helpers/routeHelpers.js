import { FlowRouter } from 'meteor/kadira:flow-router';

import { getSelectedOrgSerialNumber } from '/imports/api/helpers';

const getOrgSerialNumber = ({ orgSerialNumber } = {}) => (
  orgSerialNumber ||
  FlowRouter.getParam('orgSerialNumber') ||
  getSelectedOrgSerialNumber()
);

const getFilter = ({ filter } = {}) =>
  filter || FlowRouter.getQueryParam('filter') || 1;

const createPathGetter = (path, urlItemIdParamName = 'urlItemId') => (params, queryParams) => {
  const orgSerialNumber = getOrgSerialNumber(params);
  const _params = { ...params, orgSerialNumber, [urlItemIdParamName]: params.urlItemId };
  const filter = getFilter(queryParams);
  const _queryParams = queryParams || { filter };

  return FlowRouter.path(path, _params, _queryParams);
};

const createRedirectHandler = (pathGetter) => (params, queryParams) => {
  const path = pathGetter(params, queryParams);

  return FlowRouter.withReplaceState(() => FlowRouter.go(path));
};

export const getPathToStandard = createPathGetter('standard');

export const getPathToDiscussion = createPathGetter('standardDiscussion');

export const getPathToNC = createPathGetter('nonconformity');

export const getPathToRisk = createPathGetter('risk', 'riskId');

export const getPathToWorkItem = createPathGetter('workInboxItem', 'workItemId');

export const getPathToCustomer = createPathGetter('customer');

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

export const goToStandard = createRedirectHandler(getPathToStandard);

export const goToCustomer = createRedirectHandler(getPathToCustomer);
