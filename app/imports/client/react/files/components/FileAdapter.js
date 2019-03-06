import React from 'react';
import PropTypes from 'prop-types';
import { is } from 'ramda';

import FileInputContainer from './FileInputContainer';

const FileAdapter = ({
  input,
  onChange,
  ...rest
}) => (
  <FileInputContainer
    {...rest}
    fileIds={is(Array, input.value) ? input.value : [input.value]}
    onAfterCreate={(fileId) => {
      input.onChange(fileId);
      if (onChange) onChange(fileId);
    }}
    onAfterRemove={() => {
      input.onChange(null);
      if (onChange) onChange();
    }}
  />
);

FileAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default FileAdapter;
