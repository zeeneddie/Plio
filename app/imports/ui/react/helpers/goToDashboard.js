import { FlowRouter } from 'meteor/kadira:flow-router';

const goToDashboard = () => {
  const orgSerialNumber = FlowRouter.getParam('orgSerialNumber');

  FlowRouter.go('dashboardPage', { orgSerialNumber });
};

export default goToDashboard;
