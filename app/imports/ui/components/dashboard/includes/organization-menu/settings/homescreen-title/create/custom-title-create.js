import { Template } from 'meteor/templating';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.CustomTitleCreate.viewmodel({
  mixin: ['organization', 'modal'],

  showAlert() {
    if (!this.value()) return;

    swal({
      title: 'Are you sure?',
      text: `New title "${this.value()}" will replace the current one.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Add',
      closeOnConfirm: false,
    }, () => {
      this.addNewSection();
    });
  },
  sectionHintText() {
    return this.value() ? `Add "${this.value()}" title` : 'Start typing...';
  },
  addNewSection() {
    if (!this.value()) return;

    const newItem = { _id: this.value(), title: this.value() };
    const parent = this.parent();

    parent.items([
      ...parent.items(),
      newItem,
    ]);

    parent.select(newItem);

    swal({
      title: 'Added!',
      text: `Title "${this.value()}" was added successfully.`,
      type: 'success',
      timer: ALERT_AUTOHIDE_TIME,
      showConfirmButton: false,
    });
  },
  getData() {
    const { value, selected } = this.data();
    return { value, selected };
  },
});
