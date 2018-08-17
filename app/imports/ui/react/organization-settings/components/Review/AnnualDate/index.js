import PropTypes from 'prop-types';
import React from 'react';
import { compose, getContext, withProps } from 'recompose';

import DatePicker from '../../../../forms/components/DatePicker';


const enhance = compose(
  getContext({
    changeField: PropTypes.func,
    getField: PropTypes.func,
  }),
  withProps(props => ({
    value: props.getField(props.fieldName),
    onChange: (e) => {
      props.changeField(props.fieldName, e.date);
    },
  })),
);

const ReviewAnnualDate = enhance(props => (
  <div className="form-group">
    <label className="form-control-label">
      Annual review date
    </label>
    <DatePicker
      value={props.value}
      onChange={props.onChange}
    />
  </div>
));

ReviewAnnualDate.propTypes = {
  fieldName: PropTypes.string,
};

export default ReviewAnnualDate;
