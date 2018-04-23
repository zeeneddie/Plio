import { Meteor } from 'meteor/meteor';

import { NonConformities } from '../collections';
import ProblemsService from './problems-service';
import BaseEntityService from './base-entity-service';
import { ProblemTypes, Abbreviations } from '../constants';

export default Object.assign({}, ProblemsService, {
  collection: NonConformities,

  _service: new BaseEntityService(NonConformities),

  _getDocType(_id) {
    const { type = ProblemTypes.NON_CONFORMITY } = this._getDoc(_id);
    return type;
  },

  _getAbbr: ({ type }) => type === ProblemTypes.POTENTIAL_GAIN
    ? Abbreviations.POTENTIAL_GAIN
    : Abbreviations.NONCONFORMITY,

  _getDoc(_id) {
    const NC = this.collection.findOne({ _id });
    if (!NC) {
      throw new Meteor.Error(400, 'Nonconformity or Potential gain does not exist');
    }
    return NC;
  },
});
