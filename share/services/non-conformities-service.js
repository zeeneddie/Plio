import { Meteor } from 'meteor/meteor';

import { NonConformities } from '../collections';
import ProblemsService from './problems-service';
import BaseEntityService from './base-entity-service';
import { ProblemTypes } from '../constants';

export default Object.assign({}, ProblemsService, {
  collection: NonConformities,

  _service: new BaseEntityService(NonConformities),

  _docType: ProblemTypes.NON_CONFORMITY,

  _getAbbr: ({ type }) => type === ProblemTypes.POTENTIAL_GAIN ? 'PG' : 'NC',

  _getDoc(_id) {
    const NC = this.collection.findOne({ _id });
    if (!NC) {
      throw new Meteor.Error(400, 'Nonconformity or Potential gain does not exist');
    }
    return NC;
  },
});
