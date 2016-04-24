Template.OrganizationSettings_Department.viewmodel({
  isChanged() {
    let savedName = this.templateInstance.data.name;
    const name = this.name();

    return name && name !== savedName;
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
      name: this.name()
    };
  }
});
