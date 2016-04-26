import { Template } from 'meteor/templating';

import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';
import { insert } from '/imports/api/standards/methods.js';
import { handleMethodResult } from '/imports/api/helpers.js';

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
    const { titleText:title, description, type, issueNumber, status } = this.data();
    return {
      title,
      description,
      type,
      issueNumber: parseInt(issueNumber, 10),
      status
    };
  },
  save() {
    let data = this.getData();
    this.children(vm => vm.getData && vm.getData())
        .forEach(vm => _.extend(data, vm.getData()));

    data = _.extend(data, { nestingLevel: 1, number: [2] });

    insert.call(data, handleMethodResult());
  }
});
