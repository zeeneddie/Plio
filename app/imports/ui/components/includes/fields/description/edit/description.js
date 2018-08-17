import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.DescriptionTextBox.viewmodel({
  description: '',
  textBoxArgs() {
    const { description: value } = this.data();

    return {
      value,
      onFocusOut: (e, { value: description }) => {
        invoke(this.parent(), 'update', { description });
      },
    };
  },
  getData() {
    const { value: description } = this.child('TextBoxField').getData() || {};
    return { description };
  },
});
