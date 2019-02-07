import React from 'react';
import PropTypes from 'prop-types';

import UploadsStore from '../../../../ui/utils/uploads/uploads-store';
import { composeWithTracker, swal } from '../../../util';
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
    onChange={({ file, ...source }) => {
      input.onChange(source);
      if (onChange) onChange(source);
    }}
    onRemove={() => {
      swal({
        title: 'Are you sure?',
        text: 'This attachment will be removed',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'OK',
        closeOnConfirm: true,
      }, () => {
        const { file } = input.value;
        const isUploading = file.progress < 1;
        const isFailed = file.status === 'failed' || file.status === 'terminated';
        if (isUploading && !isFailed) {
          UploadsStore.terminateUploading(file._id);
        }

        input.onChange(null);
        if (onChange) onChange();
      });
    }}
  />
);

EditSourceContainer.propTypes = {
  input: PropTypes.object,
  onChange: PropTypes.func,
};

export default enhance(EditSourceContainer);
