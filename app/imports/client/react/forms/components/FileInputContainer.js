import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import UploadService from '../../../../ui/utils/uploads/UploadService';
import UploadsStore from '../../../../ui/utils/uploads/uploads-store';
import { Files } from '../../../../share/collections';
import { insert as insertFile } from '../../../../api/files/methods';
import { swal } from '../../../util';
import FileInput from './FileInput';

const FileInputContainer = ({
  onAfterCreate,
  onAfterRemove,
  onAfterUpload,
  slingshotContext,
  slingshotDirective,
  files,
  fileIds,
  ...rest
}) => (
  <FileInput
    {...rest}
    files={files || Files.find({ _id: { $in: fileIds } }).fetch()}
    onCreate={async (file) => {
      if (!rest.withoutUploader && file) {
        const fileId = await new Promise((resolve, reject) => {
          insertFile.call({
            name: file.name,
            organizationId: slingshotContext.organizationId,
          }, (error, result) => {
            if (error) reject(error);
            resolve(result);
          });
        });

        const uploadService = new UploadService({
          slingshotDirective,
          slingshotContext,
          maxFileSize: Meteor.settings.public.otherFilesMaxSize,
          hooks: {
            afterUpload: (__, url) => onAfterUpload({ file, url, ...slingshotContext }),
          },
        });
        uploadService.uploadExisting(fileId, file);
        onAfterCreate(fileId);
      } else {
        onAfterCreate(files);
      }
    }}
    onRemove={(file) => {
      if (!rest.withoutUploader) {
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
      } else {
        onAfterRemove();
      }
    }}
  />
);

FileInputContainer.propTypes = {
  onAfterRemove: PropTypes.func.isRequired,
  onAfterCreate: PropTypes.func.isRequired,
  onAfterUpload: PropTypes.func,
  withoutUploader: PropTypes.bool,
  slingshotContext: PropTypes.object,
  slingshotDirective: PropTypes.string,
  files: PropTypes.array,
  fileIds: PropTypes.array,
};

export default FileInputContainer;
