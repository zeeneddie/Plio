import { Template } from 'meteor/templating';

import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.ESType.viewmodel({
  typeId: '',
  types() {
    return [{ _id: '', name: '' }].concat(StandardsTypes.find({}).fetch()); // add empty option
  },
  getData() {
    const { typeId } = this.data();
    return { typeId };
  }
});
