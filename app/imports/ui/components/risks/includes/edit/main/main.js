import { Template } from 'meteor/templating';

import { updateViewedBy } from '/imports/api/risks/methods.js';
import { isViewed } from '/imports/api/checkers.js';

Template.Risk_Card_Edit_Main.viewmodel({
  mixin: 'organization',
  onRendered(template) {
    const doc = template.data.risk;
    const userId = Meteor.userId();

    if (doc && !isViewed(doc, userId)) {
      Meteor.defer(() => updateViewedBy.call({ _id: doc._id }));
    }
  },
  RKGuidelines() {
    return this.organization() && this.organization().rkGuidelines;
  },
  update(...args) {
    this.parent().update(...args);
  }
});
