Template.OrganizationSettings_StandardsBookSection.viewmodel({
  isChanged() {
    const savedTitle = this.templateInstance.data.title;
    const { title } = this.getData();

    return title && title !== savedTitle;
  },
  onFocusOut() {
    if (this.isChanged()) {
      this.onChange(this);
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
