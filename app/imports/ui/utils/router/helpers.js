import { FlowRouter } from 'meteor/kadira:flow-router';

import { getSelectedOrgSerialNumber } from '../../../api/helpers';

export const getOrgSerialNumber = ({ orgSerialNumber } = {}) => (
  orgSerialNumber ||
  FlowRouter.getParam('orgSerialNumber') ||
  getSelectedOrgSerialNumber()
);

export const getFilter = ({ filter } = {}) =>
  filter || FlowRouter.getQueryParam('filter') || 1;

export const createPathGetter = (path, withOrgSerialNumber, withFilter) =>
  (params, queryParams) => {
    const _params = { ...params };
    const _queryParams = { ...queryParams };
    if (withOrgSerialNumber) {
      Object.assign(_params, { orgSerialNumber: getOrgSerialNumber(params) });
    }
    if (withFilter) {
      Object.assign(_queryParams, { filter: getFilter(queryParams) });
    }

    return FlowRouter.path(path, _params, _queryParams);
  };

export const createRedirectHandler = pathGetter => (params, queryParams) => {
  const path = pathGetter(params, queryParams);

  return FlowRouter.withReplaceState(() => FlowRouter.go(path));
};
