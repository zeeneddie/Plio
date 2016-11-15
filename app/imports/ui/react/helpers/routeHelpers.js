import { FlowRouter } from 'meteor/kadira:flow-router';

export const goToDashboard = () => {
  const orgSerialNumber = FlowRouter.getParam('orgSerialNumber');

  FlowRouter.go('dashboardPage', { orgSerialNumber });
};

