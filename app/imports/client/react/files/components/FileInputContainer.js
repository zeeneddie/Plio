import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import UploadService from '../../../../ui/utils/uploads/UploadService';
import UploadsStore from '../../../../ui/utils/uploads/uploads-store';
import { Files } from '../../../../share/collections';
import { swal } from '../../../util';
import FileInput from './FileInput';

const FileInputContainer = ({
  onAfterCreate,
  onAfterRemove,
  onAfterUpload,
  slingshotContext,
  slingshotDirective,
  fileIds,
  ...rest
}) => (
  <FileInput
    {...rest}
    files={Files.find({ _id: { $in: fileIds } }).fetch()}
    onChange={async (file) => {
      const uploadService = new UploadService({
        slingshotDirective,
        slingshotContext,
        maxFileSize: Meteor.settings.public.otherFilesMaxSize,
        fileData: {
          name: file.name,
          organizationId: slingshotContext.organizationId,
        },
        hooks: {
          afterUpload: (__, url) => {
            if (onAfterUpload) {
              onAfterUpload({ file, url, ...slingshotContext });
            }
          },
          afterInsert: onAfterCreate,
        },
      });
      uploadService.upload(file);
    }}
    onRemove={(file) => {
      swal({
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
        onAfterRemove(file._id);
      });
    }}
  />
);

FileInputContainer.propTypes = {
  onAfterRemove: PropTypes.func.isRequired,
  onAfterCreate: PropTypes.func.isRequired,
  onAfterUpload: PropTypes.func,
  slingshotContext: PropTypes.object,
  slingshotDirective: PropTypes.string,
  fileIds: PropTypes.array,
};

export default FileInputContainer;
