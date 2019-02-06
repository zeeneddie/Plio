import React from 'react';
import PropTypes from 'prop-types';

import SourceInput from './SourceInput';

const SourceAdapter = ({ input, onChange, ...rest }) => (
  <SourceInput
    {...{ ...rest, ...input }}
    onChange={(source) => {
      input.onChange(source);
      if (onChange) onChange(source);
    }}
  />
);

SourceAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default SourceAdapter;
