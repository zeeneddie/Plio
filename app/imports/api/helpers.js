const handleMethodResult = (onSuccess) => {
  return (err, res) => {
    if (err) {
      toastr.error(err.reason);
    } else {
      if (_.isFunction(onSuccess)) {
        onSuccess(res);
      }
    }
  };
};

export { handleMethodResult };