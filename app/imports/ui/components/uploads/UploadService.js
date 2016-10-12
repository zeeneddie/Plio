import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

import {
  insert as insertFile,
  updateProgress,
  updateUrl
} from '/imports/api/files/methods';
import UploadsStore from './uploads-store.js';


const defaultMaxFileSize = Meteor.settings.public.otherFilesMaxSize;

export default class UploadService {

  constructor({
    slingshotDirective,
    slingshotContext={},
    maxFileSize=defaultMaxFileSize,
    fileData={},
    hooks={}
  }) {
    this.slingshotDirective = slingshotDirective;
    this.slingshotContext = slingshotContext;
    this.maxFileSize = maxFileSize;
    this.fileData = fileData;
    this.hooks = hooks;
  }

  upload(file) {
    if (!file) {
      return;
    }

    if (file.size > this.maxFileSize) {
      toastr.error(
        `${file.name} size exceeds the allowed maximum of ${this.maxFileSize/1024/1024} MB`
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
      organizationId: this.fileData.organizationId
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

    UploadsStore.addUploader(fileId, uploader);

    uploader.send(file, this._afterUpload.bind(this, fileId));
  }

  _afterUpload(fileId, err, url) {
    if (err) {
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
      UploadsStore.removeUploader(fileId);
    });
  }

}
