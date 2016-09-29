import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants.js';
import { Discussions } from '/imports/share/collections/discussions.js';
import { Messages } from '/imports/share/collections/messages.js';
import { Organizations } from '/imports/share/collections/organizations.js';

import onCreated from './on-created.js';


export default MessageAuditConfig = {

  collection: Messages,

  collectionName: CollectionNames.MESSAGES,

  onCreated,

  updateHandlers: [],

  onRemoved: {},

  docId({ _id }) {
    return _id;
  },

  docDescription({ message }) {
    return message;
  },

  docOrgId({ discussionId }) {
    const { organizationId } = Discussions.findOne({ _id: discussionId }) || {};
    return organizationId;
  },

  docUrl({ _id, discussionId }) {
    const { organizationId, linkedTo } = Discussions.findOne({
      _id: discussionId
    }) || {};

    const { serialNumber } = Organizations.findOne({
      _id: organizationId
    }) || {};

    return Meteor.absoluteUrl(
      `${serialNumber}/standards/${linkedTo}/discussion?at=${_id}`,
      {
        rootUrl: Meteor.settings.mainApp.url
      }
    );
  }

};
