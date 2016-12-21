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

Object.assign(sweetAlert, swal);

sweetAlert.error = err => swal(
  'Oops... Something went wrong!',
  err.reason || 'Internal server error',
  'error'
);

sweetAlert.success = (title, text, {
  timer = ALERT_AUTOHIDE_TIME,
  showConfirmButton = false,
  ...other,
} = {}) => swal({
  title,
  text,
  timer,
  showConfirmButton,
  type: 'success',
  ...other,
});

export default sweetAlert;
