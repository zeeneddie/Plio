import { WorkItemsStore } from '/imports/api/constants.js';

export default {
  getStatusName(status) {
    return WorkItemsStore.STATUSES[status];
  },
  getClassByStatus(status) {
    switch(status) {
      case 0:
        return 'default';
      case 1:
        return 'warning';
      case 2:
        return 'danger';
      case 3:
        return 'success';
      default:
        return 'default';
    }
  },
  IN_PROGRESS: [0, 1, 2],
  COMPLETED: 3
};