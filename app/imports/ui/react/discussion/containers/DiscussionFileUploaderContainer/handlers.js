import { submit } from '/client/redux/actions/discussionActions';

export const addFile = ({ dispatch, disabled, discussionId, organizationId }) => {
  return (fileId, cb) => {
    if (disabled) return;

    dispatch(submit({
      organizationId,
      discussionId,
      fileId,
      type: 'file',
    }, cb));
  };
};
