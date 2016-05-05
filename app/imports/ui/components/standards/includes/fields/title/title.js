import { Template } from 'meteor/templating';

Template.ESTitle.viewmodel({
  mixin: ['modal', 'numberRegex'],
  titleText: '',
  update() {
    const { title } = this.getData();

    const number = this.parseNumber(title);
    const nestingLevel = (number && number[0].split('.').length) || 1;

    if (nestingLevel > 4) {
      this.modal().error('Maximum nesting is 4 levels. Please change your title.');
      return;
    }

    if (!this._id) return;

    if (!title) {
      this.modal().error('Title is required!');
      return;
    }

    this.parent().update({ title, nestingLevel });
  },
  getData() {
    const { titleText:title } = this.data();
    return { title };
  }
});
