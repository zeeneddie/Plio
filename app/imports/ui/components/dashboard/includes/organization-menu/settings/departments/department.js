import { Template } from 'meteor/templating';


Template.OrgSettings_Department.viewmodel({
  mixin: ['modal', 'callWithFocusCheck'],
  name: '',
  isChanged() {
    const savedName = this.templateInstance.data.name;
    const name = this.name();

    return name && name !== savedName;
  },
  onFocusOut(e) {
    if (this.isChanged()) {
      this.callWithFocusCheck(e, () => this.onChange(this));
    }
  },
  deleteFn() {
    return this.delete.bind(this);
  },
  delete() {
    this.onDelete(this);
  },
  getData() {
    return {
      name: this.name(),
    };
  },
});
