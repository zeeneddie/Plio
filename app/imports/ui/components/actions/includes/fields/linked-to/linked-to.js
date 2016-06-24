import { Template } from 'meteor/templating';


Template.Actions_LinkedTo.viewmodel({
  mixin: 'callWithFocusCheck',
  title: '',
  update(e) {
    const { title } = this.getData();
    if (title === this.templateInstance.data.title) {
      return;
    }

    this.callWithFocusCheck(e, () => {
      this.parent().update({ title });
    });
  },
  getData() {
    return { title: this.title() };
  }
});
