import { ActionStatuses } from '/imports/api/constants.js';

export default {
  getStatusName(status) {
    return ActionStatuses[status];
  },
  getClassByStatus(status) {
    switch(status) {
      case 1:
      case 4:
        return 'yellow';
      case 8:
      case 9:
        return 'success';
      case 2:
      case 5:
        return 'warning';
      case 3:
      case 6:
      case 7:
        return 'danger';
      default:
        return 'default';
    }
  }
};