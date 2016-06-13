import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.StandardsDeletedListWrapper.viewmodel({
  mixin: ['standard', 'organization', 'router'],
  onRendered() {
    const contains = !!this.standardId() && Standards.findOne({ _id: this.standardId(), isDeleted: true });
    if (!contains) {
      const items = this.items().fetch();
      if (items.length > 0) {
        const { _id } = items[0];
        this.goToStandard(_id);
      }
    }
  }
});
