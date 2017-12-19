import { Meteor } from 'meteor/meteor';

import { NonConformities } from '../collections';
import ProblemsService from './problems-service';
import BaseEntityService from './base-entity-service';
import { ProblemTypes } from '../constants';


export default Object.assign({}, ProblemsService, {
  collection: NonConformities,

  _service: new BaseEntityService(NonConformities),

  _abbr: 'NC',

  _docType: ProblemTypes.NON_CONFORMITY,

  _getDoc(_id) {
    const NC = this.collection.findOne({ _id });
    if (!NC) {
      throw new Meteor.Error(400, 'Non-conformity does not exist');
    }
    return NC;
  },
});
