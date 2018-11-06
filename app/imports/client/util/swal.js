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

swal.error = (err, title = 'Oops... Something went wrong!') => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return sweetAlert({
    title,
    text: err.reason || 'Internal server error',
    type: 'error',
    timer: ALERT_AUTOHIDE_TIME,
    showConfirmButton: false,
  });
};

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
  swal({ showLoaderOnConfirm, ...props }, callbackValue => cb(callbackValue)
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

swal.withExtraAction = ({
  extraButtonClass = 'btn-md btn-primary',
  confirmButtonClass = 'btn-md btn-danger',
  extraButton = 'Extra',
  confirmHandler,
  extraHandler,
  ...props
}) => swal.promise({
  extraButtonClass,
  confirmButtonClass,
  extraButton,
  ...props,
}, (callbackValue) => {
  if (callbackValue === 'extraButton') {
    return extraHandler();
  }
  return confirmHandler();
});

export default Object.assign(swal, sweetAlert);
