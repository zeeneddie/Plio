import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { HelpDocs } from '/imports/share/collections/help-docs';
import { Organizations } from '/imports/share/collections/organizations';
import { Standards } from '/imports/share/collections/standards.js';
import { canChangeStandards, canChangeHelpDocs } from '/imports/api/checkers';
import MammothService from './service.js';
import HelpDocService from '/imports/api/help-docs/help-doc-service';
import StandardsService from '/imports/api/standards/standards-service.js';


export const convertStandardFileToHtml = new ValidatedMethod({
  name: 'Mammoth.convertStandardFileToHtml',

  validate: new SimpleSchema({
    fileUrl: {
      type: SimpleSchema.RegEx.Url,
    },
    htmlFileName: {
      type: String,
    },
    source: {
      type: String,
    },
    standardId: {
      type: SimpleSchema.RegEx.Id,
    },
    options: {
      type: Object,
      optional: true,
      blackbox: true,
    },
  }).validator(),

  run({
    fileUrl, htmlFileName, source, standardId, convertParams,
  }) {
    const userId = this.userId;
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unathorized user cannot convert docx files');
    }

    const standard = Standards.findOne({ _id: standardId });
    if (!standard) {
      throw new Meteor.Error(400, 'Standard does not exist');
    }

    const { organizationId } = standard;
    if (!canChangeStandards(userId, organizationId)) {
      throw new Meteor.Error(403, 'You are not authorized for changing standards');
    }

    this.unblock();

    const { standardsFilesDir } = Meteor.settings.AWSS3Bucket;
    const s3Params = {
      Key: `uploads/${organizationId}/${standardsFilesDir}/${standardId}/${Random.id()}-${htmlFileName}`,
    };

    const afterConvertation = (htmlUrl) => {
      if (standard[source]) {
        StandardsService.update({
          _id: standardId,
          [`${source}.htmlUrl`]: htmlUrl,
        });
      }
    };

    return MammothService.convertToHtml({
      fileUrl,
      htmlFileName,
      s3Params,
      convertParams,
      afterConvertation,
    });
  },
});

export const convertHelpDocFileToHtml = new ValidatedMethod({
  name: 'Mammoth.convertHelpDocFileToHtml',

  validate: new SimpleSchema({
    fileUrl: {
      type: SimpleSchema.RegEx.Url,
    },
    htmlFileName: {
      type: String,
    },
    helpDocId: {
      type: SimpleSchema.RegEx.Id,
    },
  }).validator(),

  run({ fileUrl, htmlFileName, helpDocId }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unathorized user cannot convert docx files');
    }

    const helpDoc = HelpDocs.findOne({ _id: helpDocId });
    if (!helpDoc) {
      throw new Meteor.Error(400, 'Help document does not exist');
    }

    if (!canChangeHelpDocs(this.userId)) {
      throw new Meteor.Error(403, 'You are not authorized for converting files for help documents');
    }

    this.unblock();

    const { _id: organizationId } = Organizations.findOne({ isAdminOrg: true });
    const { helpDocsFilesDir } = Meteor.settings.AWSS3Bucket;
    const s3Params = {
      Key: `uploads/${organizationId}/${helpDocsFilesDir}/${helpDocId}/${Random.id()}-${htmlFileName}`,
    };

    const afterConvertation = (htmlUrl) => {
      if (helpDoc.source) {
        HelpDocService.update({
          _id: helpDocId,
          'source.htmlUrl': htmlUrl,
        });
      }
    };

    return MammothService.convertToHtml({
      fileUrl,
      htmlFileName,
      s3Params,
      afterConvertation,
    });
  },
});
