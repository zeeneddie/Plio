import { Meteor } from 'meteor/meteor';

// Import all collections that should be filled with fixture data here
import { Organizations } from '/imports/api/organizations/organizations.js';
import { Occurrences } from '/imports/api/occurrences/occurrences.js';
import { Standards } from '/imports/api/standards/standards.js';
import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { StandardsBookSections } from '/imports/api/standards-book-sections/standards-book-sections.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Actions } from '/imports/api/actions/actions.js';
import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { Risks } from '/imports/api/risks/risks.js';
import { WorkItems } from '/imports/api/work-items/work-items.js';
import { LessonsLearned } from '/imports/api/lessons/lessons.js';
import { Discussions } from '/imports/api/discussions/discussions.js';

import { insertMessageFixtures } from './fixtures-messages.js';

import Auditor from '/imports/core/audit/server/auditor.js';

// Extend the global object to have a scope of collections
_.extend(global, { Organizations, Occurrences, Standards, StandardTypes, StandardsBookSections, NonConformities, Actions, RiskTypes, Risks, WorkItems, LessonsLearned, Discussions });

import path from 'path';
import fs from 'fs';
import { EJSON } from 'meteor/ejson';

import { UserRoles } from '/imports/api/constants.js';

// If attrPath is 'Organization' and obj is global, it returns the value of global.Organization
// If attrPath is 'Meteor.users' and obj is this, it returns the value of this.Meteor.users
const getAttributeValue = (obj, attrPath) => {
  let attrName, len;
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
    console.log("Can't load fixtures from directory '" + assetsDir + "'! " + error);
    return;
  }
  return _.map(files, function(fileName) {
    const filePath = path.join(assetsDir, fileName);
    return EJSON.parse(Assets.getText(filePath));
  });
};

const fillCollection = (collection, assets) => {
  if (!collection.find().count()) {
    return _.each(assets, function(doc) {
      collection.insert(doc, { validate: false });
    });
  }
};

const logAction = (assetsNumber, collectionName) => {
  let msg;
  if (_.every(arguments, _.identity)) {
    msg = ["Created " + assetsNumber + " new fixtures", "for the " + collectionName + " collection."];
    msg = msg.join(' ');
    return console.log(msg);
  }
};

Meteor.startup(() => {
  Auditor.stopAudit();

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

  insertMessageFixtures(1000);

  Auditor.startAudit();
});