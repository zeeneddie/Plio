import { FlowRouter } from 'meteor/kadira:flow-router';

import { getSelectedOrgSerialNumber } from '/imports/api/helpers';

export const getOrgSerialNumber = ({ orgSerialNumber } = {}) => (
  orgSerialNumber ||
  FlowRouter.getParam('orgSerialNumber') ||
  getSelectedOrgSerialNumber()
);

export const getFilter = ({ filter } = {}) =>
  filter || FlowRouter.getQueryParam('filter') || 1;

export const createPathGetter = (path) =>
  (params, queryParams) => {
    const orgSerialNumber = getOrgSerialNumber(params);
    const _params = { ...params, orgSerialNumber };
    const filter = getFilter(queryParams);
    const _queryParams = queryParams || { filter };

    return FlowRouter.path(path, _params, _queryParams);
  };

export const createRedirectHandler = (pathGetter) => (params, queryParams) => {
  const path = pathGetter(params, queryParams);

  return FlowRouter.withReplaceState(() => FlowRouter.go(path));
};
