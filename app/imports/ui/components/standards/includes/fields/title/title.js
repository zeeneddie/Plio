import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.ESTitle.viewmodel({
  mixin: ['callWithFocusCheck', 'numberRegex'],
  titleText: '',
  update(e, viewmodel) {
    this.callWithFocusCheck(e, () => {
      if (!this._id) return;

      const { value:title } = viewmodel.getData();
      const modal = ViewModel.findOne('ModalWindow');
      const number = this.parseNumber(title);
      const nestingLevel = (number && number[0].split('.').length) || 1;

      if (nestingLevel > 4) {
        modal.setError('Maximum nesting is 4 levels. Please change your title.');
        return;
      }

      if (!title) {
        modal.setError('Title is required!');
        return;
      }

      this.parent().update({ title, nestingLevel });
    });
  },
  getData() {
    const { value:title } = this.child().getData();
    return { title };
  }
});
