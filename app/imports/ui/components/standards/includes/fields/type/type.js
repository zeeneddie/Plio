import { Template } from 'meteor/templating';

import { StandardsTypes } from '/imports/api/standards-types/standards-types.js';

Template.ESType.viewmodel({
  mixin: ['modal', 'organization'],
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
      const sectionToCollapse = ViewModel.findOne('ListItem', (viewmodel) => {
        return viewmodel.type() === 'standardSection' &&
          this.parent().standard() &&
          viewmodel.parent()._id() === this.parent().standard().sectionId && 
          viewmodel.parent().parent()._id() === this.typeId();
      });

      const typeToCollapse = ViewModel.findOne('ListItem', (viewmodel) => {
        return viewmodel.type() === 'standardType' &&
          viewmodel.parent()._id() === this.typeId();
      });

      typeToCollapse && typeToCollapse.toggleCollapse();
      sectionToCollapse && sectionToCollapse.toggleCollapse();
    });
  },
  getData() {
    const { typeId } = this.data();
    return { typeId };
  }
});
