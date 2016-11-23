import { FlowRouter } from 'meteor/kadira:flow-router';

export const goToDashboard = (serialNumber) => {
  const orgSerialNumber = serialNumber || FlowRouter.getParam('orgSerialNumber');

  FlowRouter.go('dashboardPage', { orgSerialNumber });
};
