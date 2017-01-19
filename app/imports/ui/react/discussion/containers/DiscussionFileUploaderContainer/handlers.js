import { submit } from '/imports/client/store/actions/discussionActions';

export const addFile = ({ dispatch, disabled, discussionId, organizationId }) =>
  (fileId, cb) => !disabled && (
    dispatch(submit({
      organizationId,
      discussionId,
      fileId,
      type: 'file',
    }, cb))
  );
