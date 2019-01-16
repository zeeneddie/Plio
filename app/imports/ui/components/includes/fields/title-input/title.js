import { Template } from 'meteor/templating';

import { StringLimits } from '../../../../../share/constants';

const defaults = {
  label: 'Title',
  value: '',
  placeholder: 'Title',
  className: 'form-control',
  withFocusCheck: true,
  autoFocus: true,
  maxLength: StringLimits.title.max,
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
      maxLength = defaults.maxLength,
      autoFocus = defaults.autoFocus,
    } = this.data();

    const { onFocusOut = () => {} } = this.templateInstance.data;

    return {
      value,
      className,
      placeholder,
      maxLength,
      autoFocus,
      onFocusOut: (e) => {
        const targetValue = e.target.value;

        if (value === targetValue) return false;

        return withFocusCheck
          ? this.callWithFocusCheck(e, () => onFocusOut(e, { value: targetValue }))
          : onFocusOut(e, { value: targetValue });
      },
    };
  },
});
