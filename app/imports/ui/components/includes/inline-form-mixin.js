ViewModel.mixin({
  inlineForm: {
    editMode(val) {
      const buttons = this.child('InlineFormButtons');

      if (val !== undefined) {
        buttons.editMode(val);
      }

      return buttons.editMode();
    },
    destroy() {
      Blaze.remove(this.templateInstance.view);
    }
  }
});
