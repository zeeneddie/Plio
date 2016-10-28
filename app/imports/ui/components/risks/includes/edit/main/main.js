import { Template } from 'meteor/templating';

import { updateViewedBy } from '/imports/api/risks/methods.js';
import { isViewed } from '/imports/api/checkers.js';
import { RisksHelp } from '/imports/api/help-messages';

Template.Risk_Card_Edit_Main.viewmodel({
  mixin: 'organization',
  standardFieldHelp: RisksHelp.standards,
  departmentsFieldHelp: RisksHelp.departments,

  onRendered(template) {
    const doc = template.data.risk;
    const userId = Meteor.userId();

    if (doc && !isViewed(doc, userId)) {
      updateViewedBy.call({ _id: doc._id });
    }
  },
  RKGuidelines() {
    return this.organization() && this.organization().rkGuidelines;
  },
  update(...args) {
    this.parent().update(...args);
  }
});
