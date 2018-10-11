import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'plio-util';

import WithState from './WithState';
import renderComponent from './renderComponent';

const HoverSensor = ({ onChange = noop, ...props }) => (
  <WithState initialState={{ isHovered: false }}>
    {({ state, setState }) => renderComponent({
      ...props,
      ...state,
      bind: {
        onMouseEnter: () => setState({ isHovered: true }, () => onChange(state)),
        onMouseLeave: () => setState({ isHovered: false }, () => onChange(state)),
      },
    })}
  </WithState>
);

HoverSensor.propTypes = {
  onChange: PropTypes.func,
};

export default HoverSensor;
