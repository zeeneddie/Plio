import { FlowRouter } from 'meteor/kadira:flow-router';

import { getSelectedOrgSerialNumber } from '/imports/api/helpers';

export const goToDashboard = (serialNumber) => {
  const orgSerialNumber = serialNumber ||
    FlowRouter.getParam('orgSerialNumber') ||
    getSelectedOrgSerialNumber();

  FlowRouter.go('dashboardPage', { orgSerialNumber });
};
