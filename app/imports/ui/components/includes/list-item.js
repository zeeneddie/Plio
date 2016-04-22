import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.ListItem.viewmodel({
  standards() {
    return Standards.find({ sectionId: this._id() });
  },
  eq(item1, item2) {
    return item1 === item2;
  },
  collapsed: true,
  toggleCollapse: _.throttle(function() {
    this.collapse.collapse('toggle');
    this.collapsed(!this.collapsed());
  }, 500),
});
