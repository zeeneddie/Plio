import React from 'react';
import PropTypes from 'prop-types';

import FileInput from './FileInput';

const FileAdapter = ({ input, onChange, ...rest }) => (
  <FileInput
    {...{ ...rest, ...input }}
    onChange={(event) => {
      const file = event.currentTarget.files[0];
      input.onChange(file);
      if (onChange) onChange(file);
    }}
    onRemove={() => {
      input.onChange();
      if (onChange) onChange();
    }}
  />
);

FileAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default FileAdapter;
