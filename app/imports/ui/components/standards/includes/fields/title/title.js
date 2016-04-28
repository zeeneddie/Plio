import { Template } from 'meteor/templating';

Template.ESTitle.viewmodel({
  titleText: '',
  update() {
    const { title } = this.getData();
    this._id && this.parent().update({ title });
  },
  getData() {
    const { titleText:title } = this.data();
    return { title };
  }
});
