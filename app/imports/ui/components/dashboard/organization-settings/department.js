Template.OrganizationSettings_Department.viewmodel({
  mixin: ['modal', 'clearableField'],
  isChanged() {
    let savedName = this.templateInstance.data.name;
    const name = this.name();

    return name && name !== savedName;
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
      name: this.name()
    };
  }
});
