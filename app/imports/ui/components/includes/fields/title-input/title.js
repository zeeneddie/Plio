import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.TitleInput.viewmodel({
  mixin: 'callWithFocusCheck',
  label: 'Title',
  value: '',
  placeholder: 'Title',
  className: 'form-control',
  inputArgs() {
    const {
      value,
      className = 'form-control',
      placeholder = 'Title'
    } = this.data();

    const { onFocusOut = () => {} } = this.templateInstance.data;

    return {
      value,
      className,
      placeholder,
      onFocusOut: e =>
        this.callWithFocusCheck(e, () => {
          const val = e.target.value;

          if (!val) {
            invoke(
              ViewModel.findOne('ModalWindow'),
              'setError',
              'Title is required!'
            );

            this.value(value);

            this.value.changed();

            return this.value();
          }

          if (Object.is(val, value)) return;

          return onFocusOut(e, { value: val });
        })
    };
  }
});
