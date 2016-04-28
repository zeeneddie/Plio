import { Template } from 'meteor/templating';

import { update } from '/imports/api/standards/methods.js';

Template.ESTitle.viewmodel({
  mixin: 'modal',
  titleText: '',
  update() {
    if (!this._id || !this.titleText()) return;
    const { _id } = this.data();
    const { title } = this.getData();
    update.call({ _id, title }, this.modal().handleMethodResult());
  },
  getData() {
    const { titleText:title } = this.data();
    return { title };
  }
});
