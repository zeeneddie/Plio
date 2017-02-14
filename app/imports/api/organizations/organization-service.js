import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Random } from 'meteor/random';

import { Organizations } from '/imports/share/collections/organizations';
import StandardsBookSectionService from '../standards-book-sections/standards-book-section-service';
import StandardsTypeService from '../standards-types/standards-type-service';
import RisksTypeService from '../risk-types/risk-types-service';
import {
  DefaultStandardSections,
  DefaultStandardTypes,
  DefaultRiskTypes,
  OrganizationDefaults,
  OrgOwnerRoles,
  OrgMemberRoles,
  UserMembership,
  UserRoles,
  DocumentTypes,
  SystemName,
} from '/imports/share/constants';
import { generateSerialNumber, getCollectionByDocType } from '/imports/share/helpers';
import { assoc, omitC, compose } from '/imports/api/helpers';
import OrgNotificationsSender from './org-notifications-sender';
import { Actions } from '/imports/share/collections/actions';
import { AuditLogs } from '/imports/share/collections/audit-logs';
import { Departments } from '/imports/share/collections/departments';
import { Discussions } from '/imports/share/collections/discussions';
import { Files } from '/imports/share/collections/files';
import { LessonsLearned } from '/imports/share/collections/lessons';
import { Messages } from '/imports/share/collections/messages';
import { NonConformities } from '/imports/share/collections/non-conformities';
import { Occurrences } from '/imports/share/collections/occurrences';
import { RiskTypes } from '/imports/share/collections/risk-types';
import { Risks } from '/imports/share/collections/risks';
import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { StandardTypes } from '/imports/share/collections/standards-types';
import { Standards } from '/imports/share/collections/standards';
import { WorkItems } from '/imports/share/collections/work-items';


const OrganizationService = {
  collection: Organizations,

  insert({ name, timezone, currency, ownerId }) {
    const serialNumber = generateSerialNumber(this.collection, {}, 100);

    const { workflowDefaults, reminders, ncGuidelines, rkGuidelines, rkScoringGuidelines } = OrganizationDefaults;

    const organizationId = this.collection.insert({
      name,
      timezone,
      currency,
      serialNumber,
      users: [{
        userId: ownerId,
        role: UserMembership.ORG_OWNER
      }],
      workflowDefaults,
      reminders,
      ncGuidelines,
      rkGuidelines,
      rkScoringGuidelines,
      createdBy: ownerId
    });

    _.each(DefaultStandardSections, ({ title }) => {
      StandardsBookSectionService.insert({
        title,
        organizationId,
        createdBy: ownerId
      });
    });

    _.each(DefaultStandardTypes, ({ title, abbreviation }) => {
      StandardsTypeService.insert({
        title,
        abbreviation,
        organizationId,
        createdBy: ownerId
      });
    });

    _.each(DefaultRiskTypes, ({ title }) => {
      RisksTypeService.insert({
        title,
        organizationId,
        createdBy: ownerId
      });
    });

    Roles.addUsersToRoles(ownerId, OrgOwnerRoles, organizationId);

    new OrgNotificationsSender(organizationId).orgCreated();

    return organizationId;
  },

  remove() {

  },

  setName({ _id, name }) {
    return this.collection.update({ _id }, {
      $set: { name }
    });
  },

  setTimezone({ _id, timezone }) {
    return this.collection.update({ _id }, {
      $set: { timezone }
    });
  },

  setDefaultCurrency({ _id, currency }) {
    return this.collection.update({ _id }, {
      $set: { currency }
    });
  },

  setWorkflowDefaults({ _id, type, ...args }) {
    const $set = {};
    for (let key in args) {
      $set[`workflowDefaults.${type}.${key}`] = args[key];
    }

    return this.collection.update({ _id }, { $set });
  },

  setReminder({ _id, type, reminderType, timeValue, timeUnit }) {
    return this.collection.update({ _id }, {
      $set: {
        [`reminders.${type}.${reminderType}`]: {timeValue, timeUnit}
      }
    });
  },

  setNCGuideline({_id, type, text}) {
    return this.collection.update({ _id }, {
      $set: {
        [`ncGuidelines.${type}`]: text
      }
    });
  },

  setRKGuideline({ _id, type, text }) {
    const query = { _id };
    const options = {
      $set: {
        [`rkGuidelines.${type}`]: text
      }
    };
    return this.collection.update(query, options);
  },

  setRKScoringGuidelines({ _id, rkScoringGuidelines }) {
    const query = { _id };
    const options = { $set: { rkScoringGuidelines } };
    return this.collection.update(query, options);
  },

  removeUser({ userId, organizationId, removedBy }) {
    Roles.removeUsersFromRoles(
      userId, _.values(UserRoles), organizationId
    );

    const ret = this.collection.update({
      _id: organizationId,
      'users.userId': userId
    }, {
      $set: {
        'users.$.isRemoved': true,
        'users.$.removedBy': removedBy,
        'users.$.removedAt': new Date()
      }
    });

    Meteor.isServer && Meteor.defer(() =>
      new OrgNotificationsSender(organizationId).userRemoved(userId, removedBy)
    );

    return ret;
  },

  createTransfer({ organizationId, newOwnerId, currOwnerId }) {
    const transferId = Random.id();

    this.collection.update({
      _id: organizationId,
    }, {
      $set: {
        transfer: {
          newOwnerId,
          _id: transferId,
          createdAt: new Date()
        }
      }
    });

    Meteor.isServer && Meteor.defer(() =>
      new OrgNotificationsSender(organizationId).transferCreated(
        newOwnerId, transferId, currOwnerId
      )
    );
  },

  transfer({ newOwnerId, transferId }, organization) {
    const organizationId = organization._id;
    const currOwnerId = organization.ownerId();

    this.collection.update({
      _id: organizationId,
      'users.userId': newOwnerId
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_OWNER
      }
    });

    Roles.removeUsersFromRoles(currOwnerId, OrgMemberRoles, organizationId);
    Roles.addUsersToRoles(newOwnerId, OrgOwnerRoles, organizationId);

    this.collection.update({
      _id: organizationId,
      'users.userId': currOwnerId
    }, {
      $set: {
        'users.$.role': UserMembership.ORG_MEMBER
      }
    });

    Roles.removeUsersFromRoles(currOwnerId, OrgOwnerRoles, organizationId);
    Roles.addUsersToRoles(currOwnerId, OrgMemberRoles, organizationId);

    this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' }
    });

    Meteor.isServer && Meteor.defer(() =>
      new OrgNotificationsSender(organizationId).transferCompleted(newOwnerId, currOwnerId)
    );
  },

  cancelTransfer({ organizationId }) {
    return this.collection.update({
      _id: organizationId,
    }, {
      $unset: { transfer: '' }
    });
  },

  updateUserSettings({ organizationId, userId, ...args }) {
    const modifier = {};
    _(args).each((val, key) => {
      _(modifier).extend({ [`users.$.${key}`]: val });
    });

    return this.collection.update({
      _id: organizationId,
      'users.userId': userId
    }, {
      $set: { ...modifier }
    });
  },

  setTitleValue({ organizationId, fieldName, fieldValue }) {
    return this.collection.update({
      _id: organizationId,
    }, {
      $set: { [`homeScreenTitles.${fieldName}`]: fieldValue },
    });
  },

  deleteOrganization({ organizationId }) {
    const organization = this.collection.findOne({ _id: organizationId }, {
      fields: { 'users.userId': 1 }
    });

    const orgUsersIds = _(organization.users).pluck('userId');
    Roles.removeUsersFromRoles(
      orgUsersIds,
      _.union(OrgOwnerRoles, OrgMemberRoles),
      organizationId
    );

    const collections = [
      Actions,
      AuditLogs,
      Departments,
      Discussions,
      Files,
      LessonsLearned,
      Messages,
      NonConformities,
      Occurrences,
      RiskTypes,
      Risks,
      StandardsBookSections,
      StandardTypes,
      Standards,
      WorkItems
    ];

    _(collections).each(coll => coll.direct.remove({ organizationId }));

    return this.collection.remove({ _id: organizationId });
  },

  changeCustomerType({ organizationId, customerType }) {
    const query = { _id: organizationId };
    const modifier = {
      $set: {
        customerType,
      },
    };

    return this.collection.update(query, modifier);
  },

  unsubscribeFromDailyRecap({ orgSerialNumber, userId }) {
    const query = {
      serialNumber: orgSerialNumber,
      users: {
        $elemMatch: {
          userId,
          sendDailyRecap: true,
        },
      },
    };
    const modifier = {
      $set: {
        'users.$.sendDailyRecap': false,
      },
    };

    return this.collection.update(query, modifier);
  },

  updateLastAccessedDate({ organizationId }) {
    const query = { _id: organizationId };
    const modifier = {
      $set: {
        lastAccessedDate: new Date,
      },
    };
    return this.collection.update(query, modifier);
  },

  importDocuments({ to, from, userId, documentType }) {
    const getFieldsByDocType = (fields) => {
      switch (documentType) {
        case DocumentTypes.STANDARD:
          return Object.assign({}, fields, {
            sectionId: 1,
            uniqueNumber: 1,
            issueNumber: 1,
            nestingLevel: 1,
            source1: 1,
            source2: 1,
          });
        case DocumentTypes.RISK:
          return Object.assign({}, fields, {
            analysis: 1,
            updateOfStandards: 1,
            review: 1,
            statusComment: 1,
            scores: 1,
            serialNumber: 1,
            sequentialId: 1,
            workflowType: 1,
            identifiedBy: 1,
            identifiedAt: 1,
            magnitude: 1,
            standardsIds: 1,
          });
        default:
          return fields;
      }
    };

    const getPathsByDocType = (paths) => {
      switch (documentType) {
        case DocumentTypes.STANDARD:
          return paths.concat(['owner']);
        case DocumentTypes.RISK:
          return paths.concat([
            'identifiedBy',
            'analysis.executor',
            'analysis.completedBy',
            'updateOfStandards.executor',
            'updateOfStandards.completedBy',
            'review.reviewedBy',
          ]);
        default:
          return paths;
      }
    };

    const mapFieldsByDocType = (doc) => {
      const newDoc = Object.assign({}, omitC(['_id', 'titlePrefix'], doc), {
        organizationId: to,
        createdBy: SystemName,
      });
      // assign current user's id to object's paths
      const reducer = (prev, path) => assoc(path, userId, prev);
      const commonPaths = [];
      const paths = getPathsByDocType(commonPaths);
      const result = paths.reduce(reducer, newDoc);
      return result;
    };

    const collection = getCollectionByDocType(documentType);
    const query = { organizationId: from, isDeleted: false };
    const common = {
      typeId: 1,
      title: 1,
      description: 1,
      isDeleted: 1,
      status: 1,
      createdAt: 1,
    };
    const fields = getFieldsByDocType(common);
    const options = {
      fields,
      sort: { title: 1 },
    };
    const cursor = collection.find(query, options);
    const iterator = compose(console.log, collection.insert.bind(collection), mapFieldsByDocType);

    cursor.forEach(iterator);
  },
};

export default OrganizationService;
