import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { StringLimits } from '/imports/share/constants.js';

const defaults = {
  label: 'Title',
  value: '',
  placeholder: 'Title',
  className: 'form-control',
  withFocusCheck: true,
  maxLength: StringLimits.title.max
};

Template.TitleInput.viewmodel({
  mixin: 'callWithFocusCheck',
  ...defaults,
  inputArgs() {
    const {
      value = defaults.value,
      className = defaults.className,
      placeholder = defaults.placeholder,
      withFocusCheck = defaults.withFocusCheck,
      maxLength = defaults.maxLength
    } = this.data();

    const { onFocusOut = () => {} } = this.templateInstance.data;

    const handler = (e) => {
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
    };

    return {
      value,
      className,
      placeholder,
      maxLength,
      onFocusOut: e => withFocusCheck
        ? this.callWithFocusCheck(e, () => handler(e))
        : handler(e)
    };
  }
});
