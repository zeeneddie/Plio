import { Template } from 'meteor/templating';

import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.ESType.viewmodel({
  mixin: 'modal',
  typeId: '',
  types() {
    const types = StandardsTypes.find({}).fetch();
    return  !this._id ? [{ _id: '', name: '' }].concat(types) : types; // add empty option
  },
  update() {
    if (!this._id) return;
    const { typeId } = this.getData();
    if (!typeId) {
      this.modal().error('Type is required!');
    }
    this.parent().update({ typeId });
  },
  getData() {
    const { typeId } = this.data();
    return { typeId };
  }
});
