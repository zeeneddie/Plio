import { Template } from 'meteor/templating';


Template.Actions_Title.viewmodel({
  mixin: 'callWithFocusCheck',
  title: '',
  update(e) {
    const { title } = this.getData();
    if (title === this.templateInstance.data.title) {
      return;
    }

    console.log('Actions_Title:');
    console.log(title);

    this.parent().update && this.parent().update({ e, title, withFocusCheck: true });
  },
  getData() {
    return { title: this.title() };
  }
});
