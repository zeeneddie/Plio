import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.Actions_Title.viewmodel({
  label: 'Title',
  title: '',
  sequentialId: '',
  titleArgs() {
    const { label, title:value, sequentialId:addon } = this.data();

    return {
      label,
      value,
      addon,
      onFocusOut: (e, { value:title }) => {
        return invoke(this.parent(), 'update', { title });
      }
    };
  },
  getData() {
    const { title } = this.data();
    return { title };
  }
});
