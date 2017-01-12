import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants';
import { Discussions } from '/imports/share/collections/discussions';
import { Messages } from '/imports/share/collections/messages';
import { Organizations } from '/imports/share/collections/organizations';

import onCreated from './on-created';


export default MessageAuditConfig = {

  collection: Messages,

  collectionName: CollectionNames.MESSAGES,

  onCreated,

  updateHandlers: [],

  onRemoved: {},

  docId({ _id }) {
    return _id;
  },

  docDescription() {
    return 'message';
  },

  docName({ message }) {
    return message;
  },

  docOrgId({ discussionId }) {
    const { organizationId } = Discussions.findOne({ _id: discussionId }) || {};
    return organizationId;
  },

  docUrl({ _id, discussionId }) {
    const { organizationId, linkedTo } = Discussions.findOne({
      _id: discussionId,
    }) || {};

    const { serialNumber } = Organizations.findOne({
      _id: organizationId,
    }) || {};

    return Meteor.absoluteUrl(
      `${serialNumber}/standards/${linkedTo}/discussion?at=${_id}`,
      {
        rootUrl: Meteor.settings.mainApp.url,
      }
    );
  },

};
