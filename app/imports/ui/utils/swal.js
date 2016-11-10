const sweetAlert = ({
  title = 'Are you sure?',
  text = '',
  type = 'warning',
  showCancelButton = true,
  confirmButtonText = '',
  closeOnConfirm = false,
}, cb) => swal({
  title,
  text,
  type,
  showCancelButton,
  confirmButtonText,
  closeOnConfirm,
}, cb);

sweetAlert.error = err => swal(
  'Oops... Something went wrong!',
  err.reason || 'Internal server error',
  'error'
);

sweetAlert.success = (title, body) => swal(title, body, 'success');

export default sweetAlert;
