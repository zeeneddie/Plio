import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';

Template.StandardsListWrapper.viewmodel({
  mixin: ['standard', 'organization', 'router', 'collapsing'],
  getTitle({ name, title }) {
    return this.type() === 'standardType' ? name : title;
  },
  onRendered() {
    const contains = !!this.standardId() && Standards.findOne({ _id: this.standardId(), isDeleted: { $in: [null, false] } });
    if (!contains) {
      const standards = this.standards().fetch();
      if (standards.length > 0) {
        const { _id } = standards[0];
        Meteor.setTimeout(() => {
          this.goToStandard(_id);
          this.expandCollapsedStandard(_id);
        }, 0);
      }
    }
  }
});
