import { Template } from 'meteor/templating';

Template.ESStatus.viewmodel({
  status: 'issued',
  getData() {
    const { status } = this.data();
    return { status };
  }
});
