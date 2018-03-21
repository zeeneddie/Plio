import { createSelector } from 'reselect';
import { filter, where, contains, map, compose, over } from 'ramda';
import { renameKeys, lenses } from 'plio-util';

import { getUserWithFullName } from '../../../../api/users/helpers';
import { getRisks } from './state';
import { getUsersByIds } from '../users';
import { getRiskTypesByIds } from '../riskTypes';

const getStandardId = (_, { standardId }) => standardId;

const selector = (standardId, risks, usersByIds, riskTypesByIds) => compose(
  map(compose(
    over(lenses.type, id => riskTypesByIds[id]),
    over(lenses.originator, id => getUserWithFullName(usersByIds[id])),
    over(lenses.owner, id => getUserWithFullName(usersByIds[id])),
    renameKeys({
      ownerId: 'owner',
      originatorId: 'originator',
      typeId: 'type',
    }),
  )),
  filter(where({ standardsIds: contains(standardId) })),
)(risks);

export default createSelector([
  getStandardId,
  getRisks,
  getUsersByIds,
  getRiskTypesByIds,
], selector);
