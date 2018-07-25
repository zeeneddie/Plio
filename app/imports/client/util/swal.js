import { swal as sweetAlert } from 'meteor/plio:bootstrap-sweetalert';

import { ALERT_AUTOHIDE_TIME } from '../../api/constants';

const swal = ({
  title = 'Are you sure?',
  text = '',
  type = 'warning',
  showCancelButton = true,
  confirmButtonText = '',
  closeOnConfirm = false,
  showLoaderOnConfirm = true,
  ...other
}, cb) => sweetAlert({
  title,
  text,
  type,
  showCancelButton,
  confirmButtonText,
  closeOnConfirm,
  showLoaderOnConfirm,
  ...other,
}, cb);

swal.error = (err, title = 'Oops... Something went wrong!') => sweetAlert({
  title,
  text: err.reason || 'Internal server error',
  type: 'error',
  timer: ALERT_AUTOHIDE_TIME,
  showConfirmButton: false,
});

swal.success = (title, body, {
  showConfirmButton = false,
  showCancelButton = false,
  timer = ALERT_AUTOHIDE_TIME,
  ...other
} = {}) => sweetAlert({
  title,
  timer,
  showConfirmButton,
  showCancelButton,
  text: body,
  type: 'success',
  ...other,
});

swal.showPasswordForm = ({
  text = 'Enter your password:',
  showCancelButton = true,
  confirmButtonText = 'Confirm',
  closeOnConfirm = false,
  showLoaderOnConfirm = true,
  ...other
}, ...rest) => sweetAlert({
  text,
  showCancelButton,
  confirmButtonText,
  closeOnConfirm,
  showLoaderOnConfirm,
  type: 'input',
  inputType: 'password',
  ...other,
}, ...rest);

swal.promise = ({
  successTitle = 'Success',
  successText = '',
  errorTitle,
  showLoaderOnConfirm = true,
  ...props
}, cb) => new Promise((resolve, reject) => {
  swal({ showLoaderOnConfirm, ...props }, () => cb()
    .then((res) => {
      swal.success(successTitle, successText);
      resolve(res);
    })
    .catch((err) => {
      swal.error(err, errorTitle);
      reject(err);
    }),
  );
});

export default Object.assign(swal, sweetAlert);
