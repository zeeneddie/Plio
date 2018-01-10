import { checkDocExistance } from '../checkers';
import { checkAndThrow } from '../helpers';
import { Messages } from '../../share/collections/messages';
import { DSC_CANNOT_SET_EARLIER_DATE } from '../errors';

export const DSC_OnUpdateViewedByChecker = ({ userId, messageId }, doc) => {
  const message = checkDocExistance(Messages, messageId);

  const { viewedBy = [] } = doc;

  const data = viewedBy.find(fields => Object.is(fields.userId, userId));

  checkAndThrow(data && data.viewedUpTo > message.createdAt, DSC_CANNOT_SET_EARLIER_DATE);

  return doc;
};
