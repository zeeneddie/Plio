import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { StringLimits } from '../../../../../../share/constants';

Template.NC_Title_Edit.viewmodel({
  label: 'Title',
  title: '',
  sequentialId: '',
  maxLength: StringLimits.title.max,
  titleArgs() {
    const {
      label,
      title: value,
      sequentialId: addon,
      maxLength,
    } = this.data();
    const withFocusCheck = !!this._id;

    return {
      label,
      value,
      addon,
      withFocusCheck,
      maxLength,
      onFocusOut: (e, { value: title }) => {
        this.title(title);

        if (!this._id) return;

        invoke(this.parent(), 'update', { title });
        if (this.onUpdate) {
          this.onUpdate({ title });
        }
      },
    };
  },
  getData() {
    const { title } = this.data();
    return { title };
  },
});
