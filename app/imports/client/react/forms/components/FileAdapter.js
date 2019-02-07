import React from 'react';
import PropTypes from 'prop-types';

import FileInput from './FileInput';

const FileAdapter = ({
  input,
  onChange,
  onRemove,
  ...rest
}) => (
  <FileInput
    {...{ ...rest, ...input }}
    onChange={(event) => {
      const file = event.currentTarget.files[0];
      input.onChange(file);
      if (onChange) onChange(file);
    }}
    onRemove={() => {
      if (onRemove) {
        onRemove();
      } else {
        input.onChange(null);
        if (onChange) onChange();
      }
    }}
  />
);

FileAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
  onRemove: PropTypes.func,
};

export default FileAdapter;
