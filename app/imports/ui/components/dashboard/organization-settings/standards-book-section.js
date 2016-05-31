Template.OrganizationSettings_StandardsBookSection.viewmodel({
  mixin: ['modal', 'clearableField'],
  title: '',
  isChanged() {
    const savedTitle = this.templateInstance.data.title;
    const { title } = this.getData();

    return title && title !== savedTitle;
  },
  onFocusOut(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
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
