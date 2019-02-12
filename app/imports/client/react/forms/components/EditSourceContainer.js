import React from 'react';
import PropTypes from 'prop-types';

import { Files } from '../../../../share/collections';
import { composeWithTracker } from '../../../util';
import SourceInput from './SourceInput';

const enhance = composeWithTracker(
  ({ input: { value: source } }, onData) => {
    if (source.fileId) {
      Files.findOne({ _id: source.fileId });
    }
    onData(null, {});
  },
);

const EditSourceContainer = ({ input, onChange, ...rest }) => (
  <SourceInput
    {...{ ...rest, ...input }}
    isEditMode
    onChange={({ fileId, url, type }) => {
      const source = fileId || url ? { url, type, fileId } : null;
      input.onChange(source);
      if (onChange) onChange(source);
    }}
  />
);

EditSourceContainer.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default enhance(EditSourceContainer);
