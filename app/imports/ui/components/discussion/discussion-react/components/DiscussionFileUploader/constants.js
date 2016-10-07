import { insert } from '/imports/api/messages/methods';
import { handleMethodResult } from '/imports/api/helpers';

export const addFile = ({ disabled, discussionId, organizationId }) => {
  return ({ fileId }, cb) => {
    if (disabled) return;

    insert.call({
      organizationId,
      discussionId,
      fileId,
      type: 'file'
    }, handleMethodResult(cb));
  }
}
