import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.ListItem.viewmodel({
  mixin: 'collapse',
  closeAllOnCollapse: true,
  standards() {
    const query = { sectionId: this._id() };
    const options = { sort: { title: 1 } };
    return Standards.find(query, options);
  },
  eq(item1, item2) {
    return item1 === item2;
  }
});
