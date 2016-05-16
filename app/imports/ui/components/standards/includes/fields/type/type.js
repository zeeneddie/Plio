import { Template } from 'meteor/templating';

import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.ESType.viewmodel({
  mixin: ['modal', 'organization', 'collapsing'],
  typeId: '',
  types() {
    const organizationId = this.organization() && this.organization()._id;
    const types = StandardsTypes.find({ organizationId }).fetch();
    return  !this._id ? [{ _id: '', name: '' }].concat(types) : types; // add empty option
  },
  update() {
    if (!this._id) return;
    const { typeId } = this.getData();
    if (!typeId) {
      this.modal().setError('Type is required!');
    }
    this.parent().update({ typeId }, () => {
      this.expandCollapsedStandard(this.parent().standard()._id);
    });
  },
  getData() {
    const { typeId } = this.data();
    return { typeId };
  }
});
