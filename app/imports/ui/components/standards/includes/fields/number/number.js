import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';

Template.StandardNumberField.viewmodel({
  helpText: 'Please enter a unique number between 1 and 10000 for this standards document',
  update() {
    if (!this._id) return;
    const { standardNumber } = this.getData();

    this.parent().update({ standardNumber });
  },
  getData() {
    const { standardNumber } = this.data();
    return { standardNumber: parseInt(standardNumber, 10) };
  },
  inputArgs() {
    return {
      placeholder: '#',
      value: this.standardNumber,
      className: 'form-control',
      onFocusOut: this.update.bind(this),
    };
  },
});
