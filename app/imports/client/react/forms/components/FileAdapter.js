import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { toastr } from 'meteor/chrismbeckett:toastr';

import { createFormError } from '../../../validation';
import { insert as insertFile } from '../../../../api/files/methods';
import { swal } from '../../../util';
import UploadsStore from '../../../../ui/utils/uploads/uploads-store';
import UploadService from '../../../../ui/utils/uploads/UploadService';
import FileInput from './FileInput';

const launchDocxRendering = (fileUrl, fileName, standardId) => {
  Meteor.call('Mammoth.convertStandardFileToHtml', {
    fileUrl,
    htmlFileName: `${fileName}.html`,
    source: 'source1',
    standardId,
  }, (error, result) => {
    if (error) {
      // HTTP errors
      toastr.error(`Failed to get .docx file: ${error}`);
    } else if (result.error) {
      // Mammoth errors
      toastr.error(`Rendering document: ${result.error}`);
    }
  });
};

const FileAdapter = ({
  input,
  onChange,
  slingshotDirective,
  slingshotContext,
  ...rest
}) => (
  <FileInput
    {...{ ...rest, ...input }}
    onChange={async (event) => {
      const triggerOnChange = (file) => {
        input.onChange(file);
        if (onChange) onChange(file);
      };

      const file = event.currentTarget.files[0];
      if (!rest.withoutUploader && file) {
        let fileId;
        try {
          fileId = await new Promise((resolve, reject) => {
            insertFile.call({
              name: file.name,
              organizationId: slingshotContext.organizationId,
            }, (error, result) => {
              if (error) reject(error);
              resolve(result);
            });
          });
        } catch (err) {
          createFormError(err.reason);
        }

        file._id = fileId;
        triggerOnChange(file);

        const uploadService = new UploadService({
          slingshotDirective,
          slingshotContext,
          maxFileSize: Meteor.settings.public.otherFilesMaxSize,
          hooks: {
            afterUpload: (__, url) => {
              const fileName = file.name;
              const extension = fileName.split('.').pop().toLowerCase();
              if (extension === 'docx') {
                launchDocxRendering(url, fileName, slingshotContext.standardId);
              }
            },
          },
        });

        uploadService.uploadExisting(fileId, file);
      }

      return triggerOnChange(file);
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
  slingshotDirective: PropTypes.string,
  slingshotContext: PropTypes.object,
  input: PropTypes.object,
  onChange: PropTypes.func,
  withoutUploader: PropTypes.bool,
};

export default FileAdapter;
