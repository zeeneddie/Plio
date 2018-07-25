import { Meteor } from 'meteor/meteor';
import { EJSON } from 'meteor/ejson';
import path from 'path';
import fs from 'fs';
import { _ } from 'meteor/underscore';

import AuditManager from '/imports/share/utils/audit-manager';
import { UserRoles } from '/imports/share/constants';
// Import all collections that should be filled with fixture data here
import {
  Organizations,
  Occurrences,
  Standards,
  StandardTypes,
  StandardsBookSections,
  NonConformities,
  Actions,
  RiskTypes,
  Risks,
  WorkItems,
  LessonsLearned,
  Discussions,
  Goals,
  Milestones,
} from '../../../share/collections';
// import { insertMessageFixtures } from './fixtures-messages';

// Extend the global object to have a scope of collections
Object.assign(global, {
  Organizations,
  Occurrences,
  Standards,
  StandardTypes,
  StandardsBookSections,
  NonConformities,
  Actions,
  RiskTypes,
  Risks,
  WorkItems,
  LessonsLearned,
  Discussions,
  Goals,
  Milestones,
});

// If attrPath is 'Organization' and obj is global, it returns the value of global.Organization
// If attrPath is 'Meteor.users' and obj is this, it returns the value of this.Meteor.users
const getAttributeValue = (obj, attrPath) => {
  let attrName,
    len;
  let attrVal = obj;
  attrPath = attrPath.split('.');
  for (let i = 0, len = attrPath.length; i < len; i++) {
    attrName = attrPath[i];
    attrVal = attrVal[attrName];
    if (_.isUndefined(attrVal) || _.isNull(attrVal)) {
      break;
    }
  }
  return attrVal;
};

const getAssets = (assetsDir) => {
  const assetsPath = path.join(Meteor.rootPath, 'assets', 'app');
  const fullPath = path.join(assetsPath, assetsDir);
  let files;
  try {
    files = fs.readdirSync(fullPath);
  } catch (error) {
    console.log(`Can't load fixtures from directory '${assetsDir}'! ${error}`);
    return;
  }
  return _.map(files, (fileName) => {
    const filePath = path.join(assetsDir, fileName);
    return EJSON.parse(Assets.getText(filePath));
  });
};

const fillCollection = (collection, assets) => {
  if (!collection.find().count()) {
    return _.each(assets, (doc) => {
      collection.insert(doc, { validate: false });
    });
  }
};

const logAction = (assetsNumber, collectionName) => {
  let msg;
  if (_.every(arguments, _.identity)) {
    msg = [`Created ${assetsNumber} new fixtures`, `for the ${collectionName} collection.`];
    msg = msg.join(' ');
    return console.log(msg);
  }
};

Meteor.startup(() => {
  AuditManager.stopAudit();

  if (!Meteor.roles.find().count()) {
    _.each(UserRoles, (name) => {
      Meteor.roles.insert({ name });
    });
  }

  const fixturesPath = 'fixtures';
  const fixturesConfigsEJSON = path.join(fixturesPath, 'configs.json');
  const fixturesConfigs = EJSON.parse(Assets.getText(fixturesConfigsEJSON));

  _.each(fixturesConfigs, (assetsDir, collectionName) => {
    const collection = getAttributeValue(global, collectionName);

    if (collection.find().count()) {
      return;
    }
    assetsDir = path.join(fixturesPath, assetsDir);
    const assets = getAssets(assetsDir);
    if (assets.length) {
      fillCollection(collection, assets);
      return logAction(assets.length, collectionName);
    }
  });

  // insertMessageFixtures(1000);

  AuditManager.startAudit();
});
