import { Template } from 'meteor/templating';

import STATUSES from '../statuses.js';

Template.StatusMenuItem.viewmodel({
  onCreated() {
    console.log(this);
  },
  isActiveStatus(index) {
    const user = Meteor.user();
    const currentStatus = STATUSES[index].text.toLowerCase();
    const statusDefault = user.statusDefault;

    return currentStatus === statusDefault;
  },
});
