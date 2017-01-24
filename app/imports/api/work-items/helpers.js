export const getClassByStatus = (status) => {
  switch (status) {
    case 0:
      return 'default';
    case 1:
      return 'warning';
    case 2:
      return 'danger';
    case 3:
      return 'success';
    default:
      return 'default';
  }
};