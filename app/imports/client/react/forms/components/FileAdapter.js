import React from 'react';
import PropTypes from 'prop-types';

import { createFormError } from '../../../validation';
import { insert as insertFile } from '../../../../api/files/methods';
import { swal } from '../../../util';
import UploadsStore from '../../../../ui/utils/uploads/uploads-store';
import FileInput from './FileInput';

const FileAdapter = ({
  input,
  onChange,
  organizationId,
  ...rest
}) => (
  <FileInput
    {...{ ...rest, ...input }}
    onChange={async (event) => {
      const file = event.currentTarget.files[0];
      if (!rest.withoutUploader && file) {
        let fileId;
        try {
          fileId = await new Promise((resolve, reject) => {
            insertFile.call({
              name: file.name,
              organizationId,
            }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            });
          });
        } catch (err) {
          createFormError(err.reason);
        }

        file._id = fileId;
      }

      input.onChange(file);
      if (onChange) onChange(file);
    }}
    onRemove={(file) => {
      const triggerOnChange = () => {
        input.onChange(null);
        if (onChange) onChange();
      };

      if (!rest.withoutUploader) {
        return swal({
          title: 'Are you sure?',
          text: 'This file will be removed',
          type: 'warning',
          confirmButtonText: 'Remove',
          showCancelButton: true,
          closeOnConfirm: true,
        }, () => {
          const isUploading = file.progress < 1;
          const isFailed = file.status === 'failed' || file.status === 'terminated';
          if (isUploading && !isFailed) {
            UploadsStore.terminateUploading(file._id);
          }
          triggerOnChange();
        });
      }

      return triggerOnChange();
    }}
  />
);

FileAdapter.propTypes = {
  organizationId: PropTypes.string,
  input: PropTypes.object,
  onChange: PropTypes.func,
  withoutUploader: PropTypes.bool,
};

export default FileAdapter;
