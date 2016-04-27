import { Template } from 'meteor/templating';

import { insert } from '/imports/api/standards/methods.js';
import { handleMethodResult } from '/imports/api/helpers.js';

Template.EditStandard.viewmodel({
  save() {
    let data = {};
    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => _.extend(data, vm.getData()));

    data = _.extend(data, { nestingLevel: 1, number: [2] });

    console.log(data);
  }
});
