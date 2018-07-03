import PropTypes from 'prop-types';
import React from 'react';
import { compose, getContext, withProps } from 'recompose';
import get from 'lodash.get';
import pluralize from 'pluralize';

import { PossibleReviewFrequencies } from '/imports/share/constants';
import Select from '../../../../forms/components/Select';


const selectOptions = (() => {
  const getText = ({ timeUnit, timeValue }) => (
    `${timeValue} ${pluralize(timeUnit, timeValue)}`
  );

  return PossibleReviewFrequencies.map((frequency, i) => ({
    value: i,
    text: getText(frequency),
  }));
})();

const getSelectValue = ({ timeValue, timeUnit } = {}) => {
  const selectedFrequency = PossibleReviewFrequencies.find(frequency => (
    (frequency.timeUnit === timeUnit) && (frequency.timeValue === timeValue)
  ));

  const selectValue = PossibleReviewFrequencies.indexOf(selectedFrequency);

  return selectValue > -1 ? selectValue : 0;
};

const enhance = compose(
  getContext({
    changeField: PropTypes.func,
    getField: PropTypes.func,
  }),
  withProps(props => ({
    options: selectOptions,
    value: getSelectValue(props.getField(props.fieldName)),
    onChange: (e) => {
      const newSelectValue = get(e, 'target.value');
      const reviewFrequency = PossibleReviewFrequencies[newSelectValue];
      if (reviewFrequency) {
        props.changeField(props.fieldName, reviewFrequency);
      }
    },
  })),
);

const ReviewFrequencySelect = enhance(props => (
  <div className="form-group">
    <label className="form-control-label">
      Review frequency
    </label>
    <Select
      value={props.value}
      options={props.options}
      onChange={props.onChange}
    />
  </div>
));

ReviewFrequencySelect.propTypes = {
  fieldName: PropTypes.string,
};

export default ReviewFrequencySelect;
