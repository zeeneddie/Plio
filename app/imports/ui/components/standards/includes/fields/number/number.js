import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.UniqueNumberField.viewmodel({
  helpText: 'Please enter a unique number between 1 and 10000 for this standards document',
  update() {
    if (!this._id) return;
    const { uniqueNumber } = this.getData();

    this.parent().update({ uniqueNumber });
  },
  getData() {
    const { uniqueNumber } = this.data();
    return { uniqueNumber: parseInt(uniqueNumber, 10) || null };
  },
  inputArgs() {
    return {
      placeholder: '#',
      value: this.uniqueNumber,
      className: 'form-control',
      onFocusOut: this.update.bind(this),
    };
  },
});
