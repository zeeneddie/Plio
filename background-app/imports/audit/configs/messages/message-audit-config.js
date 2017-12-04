import property from 'lodash.property';
import { _ } from 'meteor/underscore';

import { CollectionNames } from '/imports/share/constants';
import { Discussions } from '/imports/share/collections/discussions';
import { Messages } from '/imports/share/collections/messages';
import { getLinkedDocAuditConfig } from '../../utils/helpers';
import { propId, propOrganizationId } from '/imports/helpers/props';
import { getDocUnsubscribePath, removeQueryParams } from '/imports/helpers/url';


import onCreated from './on-created';


const MessageAuditConfig = {

  collection: Messages,

  collectionName: CollectionNames.MESSAGES,

  onCreated,

  updateHandlers: [],

  onRemoved: {},

  docId: propId,

  docName: property('message'),

  docDescription() {
    return 'message';
  },

  docOrgId({ discussionId }) {
    return propOrganizationId(Discussions.findOne({ _id: discussionId }));
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

MessageAuditConfig.docUnsubscribeUrl = _.compose(
  getDocUnsubscribePath,
  removeQueryParams,
  MessageAuditConfig.docUrl,
);

export default MessageAuditConfig;
