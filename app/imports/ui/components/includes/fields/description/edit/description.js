import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.DescriptionTextBox.viewmodel({
  description: '',
  textBoxArgs() {
    const { description:value } = this.data();

    return {
      value,
      onFocusOut: (e, { value:description }) => {
        invoke(this.parent(), 'update', { description })
      },
      onChange: (value) =>  {
        this.description(value);
      }
    };
  },
  getData() {
    const { description } = this.data();
    return { description };
  }
});
