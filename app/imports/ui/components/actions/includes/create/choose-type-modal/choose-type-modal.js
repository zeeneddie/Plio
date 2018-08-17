import { Template } from 'meteor/templating';

Template.Actions_ChooseTypeModal.viewmodel({
  mixin: ['modal', 'workInbox'],
  openCreateModal(type) {
    this.modal().close();

    Meteor.setTimeout(() => {
      const _title = this._getNameByType(type);

      this.modal().open({
        _title,
        type,
        template: 'Actions_Create',
        variation: 'save',
        isLinkedToEditable: true,
      });
    }, 400);
  },
});
