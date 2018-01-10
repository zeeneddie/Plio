import React from 'react';
import PropTypes from 'prop-types';
import { withProps, compose, lifecycle } from 'recompose';
import { map, values, view } from 'ramda';

import { Select } from '../../../components';
import { ProblemMagnitudes } from '../../../../../share/constants';
import { lenses } from '../../../../../client/util';
import { capitalize } from '../../../../../share/helpers';

const enhance = compose(
  withProps(() => ({
    options: map(magnitude => ({
      text: capitalize(magnitude),
      value: magnitude,
    }), values(ProblemMagnitudes)),
  })),
  lifecycle({
    componentDidMount() {
      if (!this.props.value) {
        const value = view(lenses.head.value, this.props.options);
        const fakeEvent = {
          target: { value },
        };
        this.props.onChange(fakeEvent);
      }
    },
  }),
);

const MagnitudeSelect = enhance(({
  value,
  onChange,
  options,
  ...props
}) => (
  <Select
    {...{
      value,
      onChange,
      options,
      ...props,
    }}
  />
));

MagnitudeSelect.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
};

export default MagnitudeSelect;
