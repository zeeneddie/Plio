import { Template } from 'meteor/templating';

import { NCStatuses } from '/imports/api/constants.js';

Template.NCStatus.viewmodel({
  status: 1,
  name() {
    return NCStatuses[this.status()];
  },
  class() {
    switch(this.status()) {
      case 1:
      case 13:
        return 'text-success';
        break;
      case 2:
      case 4:
      case 5:
      case 6:
      case 8:
      case 9:
      case 11:
        return 'text-warning';
        break;
      case 3:
      case 7:
      case 10:
      case 12:
        return 'text-danger';
        break;
      default:
        return '';
        break;
    }
  }
});
