import { Meteor } from 'meteor/meteor';
import { Organizations } from '../../api/organizations/organizations.js';
import { Standards } from '../../api/standards/standards.js';
import { StandardsBookSections } from '../../api/standardsBookSections/standardsBookSections.js';
import OrganizationService from '../../api/organizations/organization-service.js';

_.extend(global, { Organizations, Standards, StandardsBookSections });

// if the database is empty on server start, create some sample data.
import path from 'path';
import fs from 'fs';
import { EJSON } from 'meteor/ejson'
 
_.mixin({
  get: function(obj, attrPath) {
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
  }
});

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
      collection.insert(doc);
      if (collection === Meteor.users && doc.roles) {
        return Roles.addUsersToRoles(doc._id, doc.roles);
      }
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
  const fixturesPath = 'fixtures';  
  const fixturesConfigsEJSON = path.join(fixturesPath, 'configs.json');
  const fixturesConfigs = EJSON.parse(Assets.getText(fixturesConfigsEJSON));
  return _.each(fixturesConfigs, (assetsDir, collectionName) => {
    const collection = _.get(global, collectionName);
    
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
});