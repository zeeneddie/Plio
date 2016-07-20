import { Template } from 'meteor/templating';

import { updateViewedBy } from '/imports/api/non-conformities/methods.js';
import { isViewed } from '/imports/api/checkers.js';

Template.NC_Card_Edit_Main.viewmodel({
  mixin: 'organization',
  isStandardsEditable: true,
  NCGuidelines() {
    return this.organization() && this.organization().ncGuidelines;
  },
  autorun() {
    const doc = this.NC();
    const userId = Meteor.userId();

    if (!isViewed(doc, userId)) {
      Tracker.nonreactive(() => updateViewedBy());
    }
  },
  updateViewedBy() {
    const _id = this._id();

    updateViewedBy.call({ _id });
  },
  update(...args) {
    this.parent().update(...args);
  },
  getData() {
    return this.children(vm => vm.getData)
                .reduce((prev, cur) => {
                  return { ...prev, ...cur.getData() };
                }, {});
  }
});
