import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import invoke from 'lodash.invoke';
import { toastr } from 'meteor/chrismbeckett:toastr';

import { Organizations } from '/imports/share/collections/organizations';
import { SourceTypes } from '/imports/share/constants';
import { insert } from '/imports/api/help-docs/methods';
import { insert as insertFile } from '/imports/api/files/methods';
import { setModalError } from '/imports/api/helpers';
import UploadService from '/imports/ui/utils/uploads/UploadService';

Template.HelpDocs_Create.viewmodel({
  mixin: ['getChildrenData', 'modal'],

  save() {
    const data = this.getChildrenData();

    const {
      sourceType, sourceFile, sourceUrl, sourceVideoUrl,
    } = data;
    const isSourcePresent = _.every([
      sourceType,
      sourceFile || sourceUrl || sourceVideoUrl,
    ]);
    if (!isSourcePresent) {
      setModalError('The new help document cannot be created without a source file. ' +
        'Please add a source file to your help document.');
      return;
    }

    this.insert(data);
  },

  insert(args) {
    const { sourceType, sourceFile } = args;
    const { _id: organizationId } = Organizations.findOne({ isAdminOrg: true });

    if ((sourceType === SourceTypes.ATTACHMENT) && sourceFile) {
      this.modal().callMethod(insertFile, {
        name: sourceFile.name,
        organizationId,
      }, (err, fileId) => {
        if (!err && fileId) {
          this._insertHelpDoc({ ...args, fileId });
        }
      });
    } else {
      this._insertHelpDoc(args);
    }
  },

  _insertHelpDoc(args) {
    const {
      title, sectionId, ownerId, status,
      sourceType, sourceFile, sourceUrl, sourceVideoUrl, fileId,
    } = args;

    const source = { type: sourceType };
    if (sourceType === SourceTypes.ATTACHMENT) {
      _(source).extend({ fileId });
    } else {
      const url = {
        url: sourceUrl,
        video: sourceVideoUrl,
      }[sourceType];
      _(source).extend({ url });
    }

    const helpDocArgs = {
      title,
      sectionId,
      source,
      ownerId,
      status,
    };

    const cb = (_id) => {
      if (sourceFile && fileId) {
        this._uploadFile(sourceFile, fileId, _id);
      }

      FlowRouter.withReplaceState(() => {
        FlowRouter.go('helpDoc', { helpId: _id });
      });
    };

    invoke(this.card, 'insert', insert, helpDocArgs, cb);
  },
  _uploadFile(file, fileId, helpDocId) {
    const uploadService = new UploadService({
      slingshotDirective: 'helpDocFiles',
      slingshotContext: { helpDocId },
      maxFileSize: Meteor.settings.public.otherFilesMaxSize,
      hooks: {
        afterUpload: (__, url) => {
          const fileName = file.name;
          const extension = fileName.split('.').pop().toLowerCase();
          if (extension === 'docx') {
            this._launchDocxRendering(url, fileName, helpDocId);
          }
        },
      },
    });

    uploadService.uploadExisting(fileId, file);
  },
  _launchDocxRendering(fileUrl, fileName, helpDocId) {
    Meteor.call('Mammoth.convertHelpDocFileToHtml', {
      fileUrl,
      htmlFileName: `${fileName}.html`,
      helpDocId,
    }, (error, result) => {
      if (error) {
        // HTTP errors
        toastr.error(`Failed to get .docx file: ${error}`);
      } else if (result.error) {
        // Mammoth errors
        toastr.error(`Rendering document: ${result.error}`);
      }
    });
  },
  membersQuery() {
    const { users } = Organizations.findOne({ isAdminOrg: true }) || {};

    const membersIds = users
      .filter(userData => !userData.isRemoved)
      .map(userData => userData.userId);

    return { _id: { $in: membersIds } };
  },
});
