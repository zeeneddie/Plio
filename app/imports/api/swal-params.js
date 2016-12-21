export const ORG_DELETE = {
  title: 'Are you sure?',
  text: `Deleting a Plio organization will delete all records linked to that organization.
    Deleting is an irreversible action and you will not be able to recover this data afterwards.
    Do you still want to go ahead and delete?`,
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Delete',
  closeOnConfirm: false,
  confirmButtonClass: 'btn-md btn-danger',
};

export const ORG_DELETE_PASSWORD = {
  title: 'Confirm deletion of "{{orgName}}" organization',
  text: 'Enter your password:',
  type: 'input',
  inputType: 'password',
  showCancelButton: true,
  confirmButtonText: 'Confirm',
  closeOnConfirm: false,
  showLoaderOnConfirm: true,
};
