import { Template } from 'meteor/templating';

import { insert } from '/imports/api/standards-book-sections/methods.js';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.ESBookSectionCreate.viewmodel({
  mixin: ['organization', 'modal'],
  sectionHintText() {
    return this.value() ? `Add "${this.value()}" section` : 'Start typing...';
  },
  addNewSection() {
    if (!this.value()) return;

    this.showAlert();
  },
  showAlert() {
    swal({
      title: 'Are you sure?',
      text: `New section "${this.value()}" will be added.`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Add',
      closeOnConfirm: false,
    }, () => {
      this.onAlertConfirm();
    });
  },
  onAlertConfirm() {
    const title = this.value();
    const organizationId = this.organizationId();
    const cb = (err, _id) => {
      if (err) {
        swal({
          title: 'Oops... Something went wrong!',
          text: err.reason,
          type: 'error',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });
      } else {
        swal({
          title: 'Added!',
          text: `Section "${this.value()}" was added successfully.`,
          type: 'success',
          timer: ALERT_AUTOHIDE_TIME,
          showConfirmButton: false,
        });

        this.selected(_id);

        ViewModel.findOne('ESBookSection').update(this);
      }
    };

    this.modal().callMethod(insert, { title, organizationId }, cb);
  },
  getData() {
    const { value, selected } = this.data();
    return { value, selected };
  },
});
