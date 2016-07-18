import { Template } from 'meteor/templating';

import { updateViewedBy } from '/imports/api/non-conformities/methods.js';
import { isViewed } from '/imports/api/checkers.js';

Template.NC_Card_Edit_Main.viewmodel({
  isStandardsEditable: true,
  onRendered(templateInstance) {
    const doc = this.NC();
    const userId = Meteor.userId();

    if(!isViewed(doc, userId)) {
      updateViewedBy.call({ _id: doc._id });
    }
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
