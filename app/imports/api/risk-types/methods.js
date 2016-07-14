import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import RiskTypesService from './risk-types-service.js';
import { RiskTypesSchema, EditableFields } from './risk-types-schema.js';
import { RiskTypes } from './risk-types.js';
import { IdSchema, OrganizationIdSchema } from '../schemas.js';
import { UserRoles } from '../constants';

const getRiskType = (_id) => {
  const riskType = RiskTypes.findOne({ _id });

  if (!riskType) {
    throw new Meteor.Error(
      400,
      'Risk type does not exist'
    );
  }

  return riskType;
};

const checkUserRights = ({ organizationId }) => {
  const canEditOrgSettings = Roles.userIsInRole(this.userId, UserRoles.CHANGE_ORG_SETTINGS, organizationId);

  if (!canEditOrgSettings) {
    throw new Meteor.Error(
      403,
      'User is not authorized for editing organization settings'
    );
  }
};

export const insert = new ValidatedMethod({
  name: 'RiskTypes.insert',

  validate: RiskTypesSchema.validator(),

  run({ organizationId, ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a risk type'
      );
    }

    checkUserRights({ organizationId });

    return RiskTypesService.insert({ organizationId, ...args });
  }
});

export const update = new ValidatedMethod({
  name: 'RiskTypes.update',

  validate: new SimpleSchema([IdSchema, EditableFields]).validator(),

  run({ _id, ...args }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a risk type'
      );
    }

    const riskType = getRiskType(_id);

    checkUserRights(riskType);

    return RiskTypesService.update({ _id, ...args });
  }
});

export const remove = new ValidatedMethod({
  name: 'RiskTypes.remove',

  validate: IdSchema.validator(),

  run({ _id }) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a risk type'
      );
    }

    const riskType = getRiskType(_id);

    checkUserRights(riskType);

    return RiskTypesService.remove(doc);
  }
});
