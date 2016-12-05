import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

Template.HelpDocs_Title_Edit.viewmodel({
  _id: '',
  title: '',
  titleArgs() {
    const { title: value } = this.getData();
    const withFocusCheck = !!this._id;

    return {
      value,
      withFocusCheck,
      label: 'Title',
      onFocusOut: (e, { value: title }) => {
        this.title(title);

        if (!this._id) {
          return;
        }

        invoke(this.parent(), 'update', { title });
      },
    };
  },
  getData() {
    return { title: this.title() };
  },
});
