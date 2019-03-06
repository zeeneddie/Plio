import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import UploadService from '../../../../ui/utils/uploads/UploadService';
import UploadsStore from '../../../../ui/utils/uploads/uploads-store';
import { Files } from '../../../../share/collections';
import { swal, composeWithTracker } from '../../../util';
import { isFailed, isUploaded } from '../helpers';
import FileInput from './FileInput';

const enhance = composeWithTracker(({ fileIds }, onData) => {
  onData(null, {
    files: Files.find({ _id: { $in: fileIds } }).fetch(),
  });
});

const FileInputContainer = ({
  onAfterCreate,
  onAfterRemove,
  onAfterUpload,
  slingshotContext,
  slingshotDirective,
  ...rest
}) => (
  <FileInput
    {...rest}
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
        if (!isUploaded(file.progress) && !isFailed(file.status)) {
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

export default enhance(FileInputContainer);
