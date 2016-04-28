import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';
import { remove } from '/imports/api/standards/methods.js';

Template.EditStandard.viewmodel({
  share: 'standard',
  mixin: 'modal',
  standard() {
    const _id = this._id && this._id();
    return Standards.findOne({ _id });
  },
  save() {
    let data = {};
    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => _.extend(data, vm.getData()));

    data = _.extend(data, { nestingLevel: 1, number: [2] });

    console.log(data);
  },
  remove() {
    const _id = this.standard()._id;
    if (!confirm('Are you sure you want to delete this standard?')) return;
    remove.call({ _id }, this.modal().handleMethodResult(() => {
      this.selectedStandardId('');
    }));
  }
});
