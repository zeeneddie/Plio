import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { toastr } from 'meteor/chrismbeckett:toastr';
import { _ } from 'meteor/underscore';

import {
  insert as insertFile,
  updateUrl,
  updateProgress,
  terminateUploading,
} from '../../../api/files/methods.js';

export default {
  uploadData(fileId) { // find the file with fileId is being uploaded
    return _.find(this.uploads().array(), data => data.fileId === fileId);
  },
  terminateUploading(fileId) {
    const uploadData = this.uploadData(fileId);
    const uploader = uploadData && uploadData.uploader;
    if (uploader) {
      if (uploader.xhr) uploader.xhr.abort();
      this.removeUploadData(fileId);
    }
    terminateUploading.call({
      _id: fileId,
    });
  },
  removeUploadData(fileId) {
    this.uploads().remove(item => item.fileId === fileId);
  },
  uploads() {
    this.load({ share: 'uploader' });

    return this.uploads();
  },
  upload({
    files,
    maxSize,
    beforeUpload,
  }) {
    if (!files.length) {
      return;
    }

    const {
      slingshotDirective, metaContext, addFile, afterUpload,
    } = this.templateInstance.data;

    if (beforeUpload) beforeUpload();

    _.each(files, (file) => {
      const { name } = file;

      if (file.size > maxSize) {
        toastr.error(
          `${file.name} size exceeds the allowed maximum of ${maxSize / 1024 / 1024} MB`,
        );

        return;
      }

      insertFile.call({
        name,
        organizationId: this.organizationId(),
      }, (err, fileId) => {
        if (err) {
          this.terminateUploading(fileId);
          throw err;
        }

        if (addFile) addFile({ fileId });

        const uploader = new Slingshot.Upload(slingshotDirective, metaContext);

        const progressInterval = Meteor.setInterval(() => {
          const progress = uploader.progress();

          if (!progress && progress !== 0 || progress === 1) {
            Meteor.clearInterval(progressInterval);
          } else {
            updateProgress.call({ _id: fileId, progress }, (updatingErr) => {
              if (updatingErr) {
                Meteor.clearInterval(progressInterval);
                this.terminateUploading(fileId);

                throw updatingErr;
              }
            });
          }
        }, 1500);

        this.uploads().push({ fileId, uploader });

        uploader.send(file, (sendingErr, url) => {
          if (err) {
            console.log(sendingErr);
            toastr.error(sendingErr.reason);

            this.terminateUploading(fileId);
            return;
          }

          const encodedUrl = url && encodeURI(url);

          if (afterUpload) afterUpload({ fileId, url: encodedUrl });

          updateUrl.call({ _id: fileId, url: encodedUrl });
          updateProgress.call({ _id: fileId, progress: 1 }, () => {
            this.removeUploadData(fileId);
          });
        });
      });
    });
  },
};
