import moment from 'moment-timezone';

function formatDate(date) {
  if (!date) return null;

  return moment(date).format('D MMM YYYY');
}

export { formatDate };
