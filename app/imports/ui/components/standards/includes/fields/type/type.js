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
      this.modal().setError('Type is required!');
    }
    this.parent().update({ typeId }, () => {
      const sectionToCollapse = ViewModel.findOne('ListItem', (viewmodel) => {
        return viewmodel.type() === 'standardSection' &&
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
