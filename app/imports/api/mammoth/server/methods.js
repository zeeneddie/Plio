import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { Standards } from '/imports/api/standards/standards.js';
import { canChangeStandards } from '/imports/api/checkers.js';
import MammothService from './service.js';


export const convertDocxToHtml = new ValidatedMethod({
  name: 'Mammoth.convertDocxToHtml',

  validate: new SimpleSchema({
    url: {
      type: SimpleSchema.RegEx.Url
    },
    fileName: {
      type: String
    },
    source: {
      type: String
    },
    standardId: {
      type: SimpleSchema.RegEx.Id
    },
    options: {
      type: Object,
      optional: true,
      blackbox: true
    }
  }).validator(),

  run({ url, fileName, source, standardId, options }) {
    const userId = this.userId;
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unathorized user cannot convert docx files');
    }

    const standard = Standards.findOne({ _id: standardId });
    if (!standard) {
      throw new Meteor.Error(400, 'Standard does not exist');
    }

    if (!canChangeStandards(userId, standard.organizationId)) {
      throw new Meteor.Error(403, 'You are not authorized for changing standards');
    }

    this.unblock();

    return MammothService.convertToHtml({ url, fileName, source, standardId, options });
  }
});
