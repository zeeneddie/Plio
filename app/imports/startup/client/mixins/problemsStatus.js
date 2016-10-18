import { ProblemsStatuses } from '/imports/share/constants.js';

export default {
  getStatusName(status) {
    return ProblemsStatuses[status];
  },
  getShortStatusName(status) {
    switch(status) {
      case 4:
        return 'awaiting analysis';
      case 11:
        return 'awaiting update of standard(s)';
      default:
        return '';
    }
  },
  getClassByStatus(status) {
    switch(status) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 6:
      case 7:
      case 8:
      case 10:
      case 11:
      case 12:
      case 14:
      case 15:
        return 'warning';
      case 5:
      case 9:
      case 13:
      case 16:
      case 17:
        return 'danger';
      case 18:
      case 19:
        return 'success';
      default:
        return 'default';
    }
  }
};