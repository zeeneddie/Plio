import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.NC_Title_Edit.viewmodel({
  label: 'Title',
  title: '',
  sequentialId: '',
  titleArgs() {
    const { label, title: value, sequentialId: addon } = this.data();
    const withFocusCheck = !!this._id;

    return {
      label,
      value,
      addon,
      withFocusCheck,
      onFocusOut: (e, { value: title }) => {
        this.title(title);

        if (!this._id) return;

        invoke(this.parent(), 'update', { title });
      },
    };
  },
  getData() {
    const { title } = this.data();
    return { title };
  },
});
