import { Template } from 'meteor/templating';


Template.Actions_Title.viewmodel({
  mixin: 'callWithFocusCheck',
  title: '',
  update(e) {
    const { title } = this.getData();
    if (title === this.templateInstance.data.title) {
      return;
    }

    this.subcard && this.subcard().isWaiting(true);

    this.callWithFocusCheck(e, () => {
      this.parent().update({ title });
    });
  },
  getData() {
    return { title: this.title() };
  }
});
