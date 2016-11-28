import { FlowRouter } from 'meteor/kadira:flow-router';

const getOrgSerialNumber = ({ orgSerialNumber } = {}) =>
  orgSerialNumber || FlowRouter.getParam('orgSerialNumber');
const getFilter = ({ filter }) =>
  filter || FlowRouter.getQueryParam('filter') || 1;

export const goToDashboard = (params = {}) => {
  const orgSerialNumber = getOrgSerialNumber(params);

  FlowRouter.withReplaceState(() => FlowRouter.go('dashboardPage', { orgSerialNumber }));
};

export const goToStandard = (params, queryParams) => {
  const orgSerialNumber = getOrgSerialNumber(params);
  const urlItemId = params.urlItemId;
  const _params = { ...params, orgSerialNumber, urlItemId };
  const filter = getFilter(params);
  const _queryParams = queryParams || { filter };

  return FlowRouter.withReplaceState(() =>
    FlowRouter.go('standard', _params, _queryParams));
};
