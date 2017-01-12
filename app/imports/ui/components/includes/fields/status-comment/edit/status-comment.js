import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.StatusComment.viewmodel({
  statusComment: '',
  textBoxArgs() {
    const { statusComment: value } = this.data();

    return {
      value,
      label: 'Status comment',
      placeholder: 'Status comment',
      onFocusOut: (e, { value: statusComment }) => {
        invoke(this.parent(), 'update', { statusComment });
      },
    };
  },
  getData() {
    const { value: statusComment } = this.child('TextBoxField').getData() || {};
    return { statusComment };
  },
});
