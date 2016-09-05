import { Template } from 'meteor/templating';

Template.NC_Title_Edit.viewmodel({
  label: 'Non-conformity name',
  title: '',
  sequentialId: '',
  titleArgs() {
    const { label, title:value, sequentialId:addon } = this.data();

    return {
      label,
      value,
      addon,
      onFocusOut: (e, { value:title }) => {
        if (!this._id) return;

        this.parent().update({ title });
      }
    };
  },
  getData() {
    const { title } = this.data();
    return { title };
  }
});
