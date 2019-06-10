import invariant from 'invariant';

import { getWorkspaceDefaultsUpdater } from '../helpers';
import { CustomerTypes } from '../constants';
import { createOrgQueryWhereUserIsOwner } from '../mongo';

export default {
  async updateWorkspaceDefaults(
    { _id, ...workspaceDefaults },
    { userId, collections: { Organizations } },
  ) {
    const query = { _id };
    const modifier = {
      $set: {
        ...getWorkspaceDefaultsUpdater(workspaceDefaults),
        updatedBy: userId,
      },
    };
    return Organizations.update(query, modifier);
  },

  async update({
    _id,
    homeScreenType,
    lastAccessedDate,
    customerType,
    signupPath,
  }, { userId, collections: { Organizations } }) {
    const query = { _id };
    const modifier = {
      $set: {
        homeScreenType,
        lastAccessedDate,
        customerType,
        signupPath,
        updatedBy: userId,
      },
    };

    return Organizations.update(query, modifier);
  },
  async importFromTemplate(args, context) {
    const { from, to } = args;
    const {
      userId,
      collections: {
        Organizations,
        StandardTypes,
        StandardsBookSections,
        RiskTypes,
      },
    } = context;
    const template = await Organizations.findOne({
      _id: from,
      customerType: CustomerTypes.TEMPLATE,
    });

    invariant(template, 'Could not find template organization to import documents from');

    const organization = await Organizations.findOne({
      _id: to,
      ...createOrgQueryWhereUserIsOwner(userId),
    });

    invariant(organization, 'Could not find organization to import documents to');

    const query = { organizationId: from };
    const options = { fields: { title: 1, abbreviation: 1 } };
    const standardTypes = await StandardTypes.find(query, options).map(
      ({ title, abbreviation }) => ({
        title,
        abbreviation,
        organizationId: to,
        createdBy: userId,
        isDefault: true,
        reservedTitle: title,
      }),
    );
    const standardSections = await StandardsBookSections.find(query, options).map(({ title }) => ({
      title,
      organizationId: to,
      createdBy: userId,
      isDefault: true,
    }));
    const riskTypes = await RiskTypes.find(query, options).map(({ title }) => ({
      title,
      organizationId: to,
      createdBy: userId,
      isDefault: true,
    }));

    return Promise.all([
      StandardTypes.rawCollection().insertMany(standardTypes),
      StandardsBookSections.rawCollection().insertMany(standardSections),
      RiskTypes.rawCollection().insertMany(riskTypes),
    ]);
  },
};
