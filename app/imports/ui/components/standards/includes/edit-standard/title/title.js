import { Template } from 'meteor/templating';

Template.ESTitle.viewmodel({
  titleText: '',
  getData() {
    const { titleText:title } = this.data();
    return { title };
  }
});
