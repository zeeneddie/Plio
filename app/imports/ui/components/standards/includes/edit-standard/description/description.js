import { Template } from 'meteor/templating';

Template.ESDescription.viewmodel({
  description: '',
  getData() {
    const { description } = this.data();
    return { description };
  }
});
