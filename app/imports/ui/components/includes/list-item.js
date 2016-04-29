import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.ListItem.viewmodel({
  share: 'standard',
  mixin: 'collapse',
  closeAllOnCollapse: true,
  autorun() {
    if (this.selectedStandardId()) {
      const standard = Standards.findOne({ _id: this.selectedStandardId(), sectionId: this._id() });
      if (!!standard) {
        this.toggleCollapse();
      }
    }
  },
  standards() {
    const query = { sectionId: this._id() };
    const options = { sort: { title: 1 } };
    return Standards.find(query, options);
  }
});
