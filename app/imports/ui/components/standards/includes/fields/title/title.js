import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.Standards_Title_Edit.viewmodel({
  mixin: ['modal', 'numberRegex'],
  title: '',
  titleArgs() {
    const { title:value } = this.data();

    return {
      value,
      onFocusOut: (e, { value:title }) => {
        const number = this.parseNumber(title);
        const nestingLevel = (_.first(number) || '').split('.').length || 1;

        if (nestingLevel > 4) {
          return invoke(
            ViewModel.findOne('ModalWindow'),
            'setError',
            'Maximum nesting is 4 levels. Please change your title.'
          );
        }

        if (!this._id) return;

        this.parent().update({ title, nestingLevel });
      }
    };
  },
  getData() {
    const { title } = this.data();
    return { title };
  }
});
