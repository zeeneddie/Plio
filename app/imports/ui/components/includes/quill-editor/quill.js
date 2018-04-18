import { Template } from 'meteor/templating';

Template.Quill.viewmodel({
  value: '',
  onBlur: () => null,
  onBlurFn(e, vm) {
    const { html } = vm.getData();

    if (this.value() === html) return undefined;

    return this.onBlur(html);
  },
});
