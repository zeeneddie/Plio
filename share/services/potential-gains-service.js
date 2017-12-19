import { Meteor } from 'meteor/meteor';

import { PotentialGains } from '../collections';
import ProblemsService from './problems-service';
import BaseEntityService from './base-entity-service';
import { ProblemTypes } from '../constants';

export default Object.assign({}, ProblemsService, {
  collection: PotentialGains,

  _service: new BaseEntityService(PotentialGains),

  _abbr: 'PG',

  _docType: ProblemTypes.POTENTIAL_GAIN,

  _getDoc(_id) {
    const pg = this.collection.findOne({ _id });
    if (!pg) {
      throw new Meteor.Error(400, 'Potential gain does not exist');
    }
    return pg;
  },
});
