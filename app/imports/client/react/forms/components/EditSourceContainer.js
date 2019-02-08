import React from 'react';
import PropTypes from 'prop-types';

import { composeWithTracker } from '../../../util';
import { uploadFile } from '../../standards/helpers';
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

const EditSourceContainer = ({ input, onChange, ...rest }) => (
  <SourceInput
    {...{ ...rest, ...input }}
    isEditMode
    onChange={({ file, url, type }) => {
      const source = file || url ? { url, type, fileId: file && file._id } : null;
      input.onChange(source);
      if (onChange) onChange(source);

      if (type === 'attachment' && file && file._id) {
        uploadFile({
          file,
          fileId: file._id,
          standardId: rest.standardId,
          organizationId: rest.organizationId,
        });
      }
    }}
  />
);

EditSourceContainer.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default enhance(EditSourceContainer);
