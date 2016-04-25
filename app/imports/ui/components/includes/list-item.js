import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.ListItem.viewmodel({
  mixin: 'collapse',
  closeAllOnCollapse: true,
  standards() {
    const standards = Standards.find({ sectionId: this._id() });
    return standards;
  },
  eq(item1, item2) {
    return item1 === item2;
  }
});
