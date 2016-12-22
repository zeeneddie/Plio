import { FlowRouter } from 'meteor/kadira:flow-router';

import { getOrgSerialNumber, getFilter } from './helpers';
import { createRedirectHandler } from './helpers';
import { getPathToStandard, getPathToCustomer } from './paths';

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
