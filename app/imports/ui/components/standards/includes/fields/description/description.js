import { Template } from 'meteor/templating';

import { update } from '/imports/api/standards/methods.js';

Template.ESDescription.viewmodel({
  description: '',
  update() {
    const { description } = this.getData();
    this.parent().update({ description });
  },
  getData() {
    const { description } = this.data();
    return { description };
  }
});
