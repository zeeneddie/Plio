import React from 'react';
import PropTypes from 'prop-types';

import { composeWithTracker } from '../../../util';
import { Files } from '../../../../share/collections/files';
import SourceInput from './SourceInput';

const enhance = composeWithTracker(
  ({ input: { value: source, ...restInput } }, onData) => {
    let props = {};

    if (source.fileId) {
      props = {
        input: {
          ...restInput,
          value: {
            ...source,
            file: Files.findOne({ _id: source.fileId }),
          },
        },
      };
    }
    onData(null, props);
  },
);

const EditSourceAdapter = ({ input, onChange, ...rest }) => (
  <SourceInput
    {...{ ...rest, ...input }}
    onChange={({ file, ...source }) => {
      input.onChange(source);
      if (onChange) onChange(source);
    }}
  />
);

EditSourceAdapter.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default enhance(EditSourceAdapter);
