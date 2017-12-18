import { Meteor } from 'meteor/meteor';

import { PotentialGains } from '../../share/collections/potential-gains';
import ProblemsService from '../../share/services/problems-service';
import { ProblemTypes } from '../../share/constants';
import BaseEntityService from '../../share/services/base-entity-service';

export default Object.assign({}, ProblemsService, {
  collection: PotentialGains,
  _service: new BaseEntityService(PotentialGains),
  _abbr: 'PG',
  _docType: ProblemTypes.NON_CONFORMITY,
  _getDoc(_id) {
    const pg = this.collection.findOne({ _id });
    if (!pg) {
      throw new Meteor.Error(400, 'Potential gain does not exist');
    }
    return pg;
  },
});
