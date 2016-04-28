import { Template } from 'meteor/templating';

import { update } from '/imports/api/standards/methods.js';

Template.ESTitle.viewmodel({
  mixin: 'modal',
  titleText: '',
  update() {
    if (!this._id || !this.titleText()) return;
    const { _id } = this.data();
    const { title } = this.getData();
    this.modal().callMethod(update, { _id, title });
  },
  getData() {
    const { titleText:title } = this.data();
    return { title };
  }
});
