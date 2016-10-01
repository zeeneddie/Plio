import { Template } from 'meteor/templating';
const defaults = {
  label: 'Description',
  value: '',
  placeholder: 'Description',
  className: 'form-control',
  rows: 3
};

Template.TextBoxField.viewmodel({
  mixin: 'callWithFocusCheck',
  ...defaults,
  textBoxArgs() {
    const {
      value = defaults.value,
      label = defaults.label,
      className = defaults.className,
      placeholder = defaults.placeholder,
      rows = defaults.rows
    } = this.data();
    const { onFocusOut = () => {} } = this.templateInstance.data;

    return {
      value,
      label,
      className,
      placeholder,
      rows,
      onFocusOut: e =>
        this.callWithFocusCheck(e, () => {
          const val = e.target.value;

          if (Object.is(val, value)) return;

          return onFocusOut(e, { value: val });
        })
    };
  }
});
