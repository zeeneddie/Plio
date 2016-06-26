import { Template } from 'meteor/templating';


Template.Actions_LinkedTo.viewmodel({
  mixin: 'callWithFocusCheck',
  linkedDocs: [],
  update(e) {
    const { title } = this.getData();
    if (title === this.templateInstance.data.title) {
      return;
    }

    this.callWithFocusCheck(e, () => {
      this.parent().update({ title });
    });
  }
});
