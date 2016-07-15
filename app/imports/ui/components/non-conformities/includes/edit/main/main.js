import { Template } from 'meteor/templating';

import { updateViewedBy } from '/imports/api/non-conformities/methods.js';

Template.NC_Card_Edit_Main.viewmodel({
  isStandardsEditable: true,
  onRendered(templateInstance) {
    updateViewedBy.call({ _id: templateInstance.data._id });
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
