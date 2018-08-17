import PropTypes from 'prop-types';
import React from 'react';
import { Input } from 'reactstrap';
import DebounceInput from 'react-debounce-input';

const DebounceTextarea = ({ element = Input, rows = 3, ...props }) => (
  <DebounceInput
    forceNotifyByEnter={false}
    type="textarea"
    {...{ element, rows, ...props }}
  />
);

DebounceTextarea.propTypes = {
  element: PropTypes.node,
  rows: PropTypes.number,
};

export default DebounceTextarea;
