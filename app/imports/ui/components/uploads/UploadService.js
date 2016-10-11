import { Slingshot } from 'meteor/edgee:slingshot';

import {
  insert as insertFile,
  updateProgress,
  updateUrl
} from '/imports/api/files/methods';
import UploadsStore from './uploads-store.js';


export default class UploadService {

  constructor(slingshotDirective, slingshotContext, maxFileSize, organizationId, hooks={}) {
    this.slingshotDirective = slingshotDirective;
    this.slingshotContext = slingshotContext;
    this.maxFileSize = maxFileSize;
    this.organizationId = organizationId;
    this.hooks = hooks;
  }

  upload(file) {
    if (!file) {
      return;
    }

    if (file.size > this.maxFileSize) {
      toastr.error(
        `${file.name} size exceeds the allowed maximum of ${maxSize/1024/1024} MB`
      );
      return;
    }

    this._beforeInsert(file);
  }

  uploadExisting(fileId, file) {
    this._upload(file, fileId);
  }

  _beforeInsert(file) {
    const beforeInsertHook = this.hooks.beforeInsert;
    beforeInsertHook && beforeInsertHook();

    this._insert(file);
  }

  _insert(file) {
    const name = file.name;

    insertFile.call({
      name,
      extension: name.split('.').pop().toLowerCase(),
      organizationId: this.organizationId
    }, this._afterInsert.bind(this, file));
  }

  _afterInsert(file, err, fileId) {
    if (err) {
      toastr.error(err.reason || err);
      return;
    }

    const afterInsertHook = this.hooks.afterInsert;
    afterInsertHook && afterInsertHook(fileId);

    this._upload(file, fileId);
  }

  _upload(file, fileId) {
    const uploader = new Slingshot.Upload(
      this.slingshotDirective, this.slingshotContext
    );

    this._setUpProgressUpdating(fileId, uploader);
    UploadsStore.addUploadData(fileId, uploader);

    uploader.send(file, this._afterUpload.bind(this, fileId));
  }

  _afterUpload(fileId, err, url) {
    if (err) {
      console.log(err);
      toastr.error(err.reason || err);

      UploadsStore.terminateUploading(fileId);
      return;
    }

    if (url) {
      url = encodeURI(url);
    }

    const afterUploadHook = this.hooks.afterUpload;
    afterUploadHook && afterUploadHook(fileId, url);

    updateUrl.call({ _id: fileId, url });

    updateProgress.call({ _id: fileId, progress: 1 }, (err, res) => {
      UploadsStore.removeUploadData(fileId);
    });
  }

  _setUpProgressUpdating(fileId, uploader) {
    const progressInterval = Meteor.setInterval(() => {
      const progress = uploader.progress();

      if (!progress && progress != 0 || progress === 1) {
        Meteor.clearInterval(progressInterval);
      } else {
        updateProgress.call({ _id: fileId, progress }, (err, res) => {
          if (err) {
            Meteor.clearInterval(progressInterval);
            UploadsStore.terminateUploading(fileId);

            throw err;
          }
        });
      }
    }, 1500);
  }

}
