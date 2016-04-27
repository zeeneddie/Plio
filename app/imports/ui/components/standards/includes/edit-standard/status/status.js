import { Template } from 'meteor/templating';

Template.ESStatus.viewmodel({
  status: 'draft',
  getData() {
    const { status } = this.data();
    return { status };
  }
});
