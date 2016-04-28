import { Template } from 'meteor/templating';

Template.ESTitle.viewmodel({
  titleText: '',
  update() {
    if (!this._id || !this.titleText()) return;
    const { _id } = this.data();
    const { title } = this.getData();
    this.parent().update({ _id, title });
  },
  getData() {
    const { titleText:title } = this.data();
    return { title };
  }
});
