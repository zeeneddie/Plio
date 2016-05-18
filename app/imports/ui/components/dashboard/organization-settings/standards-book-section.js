Template.OrganizationSettings_StandardsBookSection.viewmodel({
  mixin: ['modal', 'clearableField'],
  isChanged() {
    const savedTitle = this.templateInstance.data.title;
    const { title } = this.getData();

    return title && title !== savedTitle;
  },
  onFocusOut() {
    this.callWithFocusCheck(() => {
      if (this.isChanged()) {
        this.onChange(this);
      }
    });
  },
  delete() {
    this.onDelete(this);
  },
  getData() {
    return {
      title: this.title()
    };
  }
});
