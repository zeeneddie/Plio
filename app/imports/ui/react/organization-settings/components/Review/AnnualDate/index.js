import React, { PropTypes } from 'react';
import { compose, getContext, withProps } from 'recompose';

import DatePicker from '../../../../forms/components/DatePicker';


const enhance = compose(
  getContext({ changeField: PropTypes.func }),
  withProps((props) => ({
    onChange: (e) => {
      const fieldName = `${props.documentKey}.annualDate`;
      props.changeField(fieldName, e.date);
    },
  })),
);

const ReviewAnnualDate = enhance((props) => (
  <DatePicker
    value={props.annualDate}
    onChange={props.onChange}
  />
));

export default ReviewAnnualDate;
