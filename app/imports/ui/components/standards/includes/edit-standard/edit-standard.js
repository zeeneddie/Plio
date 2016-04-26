import { Template } from 'meteor/templating';

import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.EditStandard.viewmodel({
  titleText: '',
  description: '',
  type: '',
  types() {
    return [{ _id: '', name: '' }].concat(StandardsTypes.find({}).fetch()); // add empty option
  },
  issueNumber: 1,
  status: 'draft',
  getData() {
    const { titleText, description, type, issueNumber, status } = this.data();
    return { titleText, description, type, issueNumber, status };
  },
  save() {
    const data = this.getData();
    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => _.extend(data, vm.getData()));
  }
});
