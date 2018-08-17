import { Template } from 'meteor/templating';


Template.OrgSettings_OrgName.viewmodel({
  name: '',
  update(e) {
    const name = this.name();

    if (name === this.templateInstance.data.name) {
      return;
    }

    this.parent().updateName && this.parent().updateName({ e, name });
  },
  getData() {
    return { name: this.name() };
  },
});
