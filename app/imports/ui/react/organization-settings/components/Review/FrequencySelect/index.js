import React, { PropTypes } from 'react';
import { compose, getContext, withProps } from 'recompose';
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

const getSelectValue = ({ timeValue, timeUnit }) => {
  const selectedFrequency = PossibleReviewFrequencies.find(frequency => (
    (frequency.timeUnit === timeUnit) && (frequency.timeValue === timeValue)
  ));

  return PossibleReviewFrequencies.indexOf(selectedFrequency);
};

const enhance = compose(
  getContext({ changeField: PropTypes.func }),
  withProps((props) => ({
    options: selectOptions,
    value: getSelectValue(props.frequency),
    onChange: (e) => {
      const reviewFrequency = PossibleReviewFrequencies[e.target.value];
      const fieldName = `${props.documentKey}.frequency`;
      props.changeField(fieldName, reviewFrequency);
    },
  })),
);

const ReviewFrequencySelect = enhance((props) => (
  <Select
    value={props.value}
    options={props.options}
    onChange={props.onChange}
  />
));

export default ReviewFrequencySelect;
