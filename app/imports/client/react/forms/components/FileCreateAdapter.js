import React from 'react';
import PropTypes from 'prop-types';

import FileInput from './FileInput';

const FileCreateAdapter = ({
  input,
  onChange,
  ...rest
}) => (
  <FileInput
    {...rest}
    files={input.value ? [input.value] : []}
    onChange={(file) => {
      input.onChange(file);
      if (onChange) onChange(file);
    }}
    onRemove={() => {
      input.onChange(null);
      if (onChange) onChange();
    }}
  />
);

FileCreateAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default FileCreateAdapter;
