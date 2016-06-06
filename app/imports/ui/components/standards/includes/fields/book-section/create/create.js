import { Template } from 'meteor/templating';

import { insert } from '/imports/api/standards-book-sections/methods.js';


Template.ESBookSectionCreate.viewmodel({
  mixin: ['organization', 'modal'],
  sectionHintText() {
    return !!this.value() ? `Add "${this.value()}" section` : 'Start typing...';
  },
  addNewSection() {
    if (!this.value()) return;

    this.showAlert();
  },
  showAlert() {
    swal(
      {
        title: "Are you sure?",
        text: `New section "${this.value()}" will be added.`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Add",
        closeOnConfirm: false
      },
      () => {
        this.onAlertConfirm();
      }
    );
  },
  onAlertConfirm() {
    const title = this.value();
    const organizationId = this.organizationId();
    const cb = (err, _id) => {
      if (err) {
        swal('Oops... Something went wrong!', err.reason, 'error');
      } else {
        swal("Added!", `Section "${this.value()}" was added successfully.`, "success");

        this._id(_id);

        ViewModel.findOne('ESBookSection').update(this);
      }
    };

    this.modal().callMethod(insert, { title, organizationId }, cb);
  },
  getData() {
    const { value, _id } = this.data();
    return { value, _id };
  }
});
