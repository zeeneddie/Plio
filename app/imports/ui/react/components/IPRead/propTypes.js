import { PropTypes } from 'react';

export default {
  label: PropTypes.string.isRequired,
  desiredOutcome: PropTypes.string,
  targetDate: PropTypes.instanceOf(Date),
  owner: PropTypes.string,
  reviewDates: PropTypes.arrayOf(PropTypes.shape({ date: PropTypes.instanceOf(Date) })),
  files: PropTypes.arrayOf(PropTypes.string),
};
