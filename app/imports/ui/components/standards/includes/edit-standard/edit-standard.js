import { Template } from 'meteor/templating';

import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.EditStandard.viewmodel({
  titleValue: '',
  description: '',
  selectedType: '',
  types() {
    return [{ _id: '', name: '' }].concat(StandardsTypes.find({}).fetch()); // add empty option
  },
  issueNumber: 1,
});
