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

const SourceAdapter = ({ input, onChange, ...rest }) => (
  <SourceInput
    {...{ ...rest, ...input }}
    onChange={({
      file,
      fileId,
      url,
      type,
    }) => {
      const source = (file || fileId || url) && ({
        url,
        type,
        fileId,
        file,
      });
      input.onChange(source || null);
      if (onChange) onChange(source);
    }}
  />
);

SourceAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default enhance(SourceAdapter);
