import { Meteor } from 'meteor/meteor';

import { CollectionNames } from '/imports/share/constants';
import { Discussions } from '/imports/share/collections/discussions';
import { Messages } from '/imports/share/collections/messages';
import { Organizations } from '/imports/share/collections/organizations';
import { getLinkedDocAuditConfig } from '../../utils/helpers';

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
    const { organizationId, linkedTo, documentType } = Discussions.findOne({
      _id: discussionId,
    }) || {};
    const config = getLinkedDocAuditConfig(documentType);
    const docUrl = config.docUrl && config.docUrl({ organizationId, _id: linkedTo });
    const url = `${docUrl}/discussion?at=${_id}`;

    return url;
  },

};
