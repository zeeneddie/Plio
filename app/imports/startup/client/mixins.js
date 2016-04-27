import { ViewModel } from 'meteor/manuel:viewmodel';

ViewModel.mixin({
  collapse: {
    collapsed: true,
    toggleCollapse: _.throttle(function() {
      this.collapse.collapse('toggle');
      this.collapsed(!this.collapsed());
    }, 500),
  },
  addForm: {
    addForm(template) {
      Blaze.renderWithData(
        Template[template],
        {
          onChange: this.onChangeCb(),
          onDelete: this.onDeleteCb()
        },
        this.forms[0]
      );
    }
  },
  editableModalSection: {
    editableModal() {
      return this.parent().child('EditableModal');
    },
    isSaving(val) {
      const editableModal = this.editableModal();

      if (val !== undefined) {
        editableModal.isSaving(val);
      }

      return editableModal.isSaving();
    },
    callMethod(method, args, cb) {
      return this.editableModal().callMethod(method, args, cb);
    },
    handleMethodResult(cb) {
      return this.editableModal().handleMethodResult(cb);
    }
  }
});
