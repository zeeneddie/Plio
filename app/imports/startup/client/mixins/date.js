import moment from 'moment-timezone';

export default {
  renderDate(date, format = 'DD MMM YYYY') {
    if (!_.isString(format)) {
      format = 'DD MMM YYYY';
    }
    return moment.isDate(date) ? moment(date).format(format) : 'Invalid date';
  },
};
