import { Template } from 'meteor/templating';

Template.ES_Description_Edit.viewmodel({
  mixin: 'callWithFocusCheck',
  description: '',
  update(e) {
    this.callWithFocusCheck(e, () => {
      const { description } = this.getData();

      if (description === this.templateInstance.data.description) return;

      this.parent().update({ description });
    });
  },
  getData() {
    const { description } = this.data();
    return { description };
  }
});
