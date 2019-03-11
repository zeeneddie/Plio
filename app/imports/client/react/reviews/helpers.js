export const getClassByStatus = (status) => {
  switch (status) {
    case 0:
      return 'danger';
    case 1:
      return 'warning';
    case 2:
      return 'success';
    default:
      return '';
  }
};
