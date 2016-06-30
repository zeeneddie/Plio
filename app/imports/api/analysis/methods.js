import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import AnalysisService from './analysis-service.js';
import { RequiredSchema, OptionalSchema } from './analysis-schema.js';
import { Analysis } from './analysis.js';
import { Problems } from '../problems/problems.js';
import { IdSchema } from '../schemas.js';

export const insert = new ValidatedMethod({
  name: 'Analysis.insert',

  validate: RequiredSchema.validator(),

  run({ ...args, nonConformityId }) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot create an occurrence');
    }

    if (!Problems.findOne({ _id: nonConformityId, type: 'non-conformity' })) {
      throw new Meteor.Error(403, 'Non-conformity with that ID does not exists');
    }

    if (!!Analysis.findOne({ nonConformityId })) {
      throw new Meteor.Error(403, 'Root case analysis for that non conformity already exists');
    }

    return AnalysisService.insert({ ...args, nonConformityId });
  }
});

export const update = new ValidatedMethod({
  name: 'Analysis.update',

  validate: new SimpleSchema([IdSchema, OptionalSchema]).validator(),

  run({_id, ...args}) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'Unauthorized user cannot update a root case analysis');
    }

    return AnalysisService.update({ _id, ...args });
  }
});
