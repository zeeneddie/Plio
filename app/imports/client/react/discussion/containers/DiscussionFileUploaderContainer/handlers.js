import { submit } from '/imports/client/store/actions/discussionActions';
import { MessageTypes } from '/imports/share/constants';

export const addFile = ({
  dispatch, disabled, discussionId, organizationId,
}) =>
  (fileId, cb) => !disabled && (
    dispatch(submit({
      organizationId,
      discussionId,
      fileId,
      type: MessageTypes.FILE,
    }, cb))
  );
