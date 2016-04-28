import { Template } from 'meteor/templating';

import { update } from '/imports/api/standards/methods.js';

Template.ESDescription.viewmodel({
  description: '',
  getData() {
    const { description } = this.data();
    return { description };
  }
});
