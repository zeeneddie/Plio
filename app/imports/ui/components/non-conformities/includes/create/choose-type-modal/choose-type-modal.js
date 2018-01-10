import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

const TYPES = { NC: 1, PG: 2 };

Template.NCs_ChooseTypeModal.viewmodel({
  mixin: 'modal',
  TYPES: () => TYPES,
  getModalTemplateNameByType(type) {
    if (type === TYPES.NC) return 'NC_Create';
    return 'PG_Create';
  },
  getTitleByType(type) {
    if (type === TYPES.NC) return 'Nonconformity';
    return 'Potential Gain';
  },
  openCreateModal(type) {
    this.modal().close();

    Meteor.setTimeout(() => {
      const template = this.getModalTemplateNameByType(type);
      const _title = this.getTitleByType(type);

      this.modal().open({
        _title,
        type,
        template,
        variation: 'save',
        isLinkedToEditable: true,
      });
    }, 400);
  },
});
