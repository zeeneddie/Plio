/* eslint-disable no-undef */

import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

const sweetAlert = ({
  title = 'Are you sure?',
  text = '',
  type = 'warning',
  showCancelButton = true,
  confirmButtonText = '',
  closeOnConfirm = false,
  ...other,
}, cb) => swal({
  title,
  text,
  type,
  showCancelButton,
  confirmButtonText,
  closeOnConfirm,
  ...other,
}, cb);

sweetAlert.error = err => swal({
  title: 'Oops... Something went wrong!',
  text: err.reason || 'Internal server error',
  type: 'error',
  timer: ALERT_AUTOHIDE_TIME,
  showConfirmButton: false,
});

sweetAlert.success = (title, body) => swal({
  title,
  text: body,
  type: 'success',
  timer: ALERT_AUTOHIDE_TIME,
  showConfirmButton: false,
});

export default sweetAlert;
