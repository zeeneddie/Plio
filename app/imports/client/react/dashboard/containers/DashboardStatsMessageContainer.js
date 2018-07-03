import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mapProps, onlyUpdateForKeys } from 'recompose';
import moment from 'moment-timezone';

import { namedCompose, withCurrentTime } from '../../helpers';
import DashboardStatsMessage from '../components/DashboardStatsMessage';
import { Files, Discussions } from '../../../../share/collections';
import { MessageTypes, DocumentTypes } from '../../../../share/constants';
import { removeEmails } from '../../../../share/mentions';
import { composeWithTracker } from '../../../util';
import { getFullNameOrEmail } from '../../../../api/users/helpers';

// (documentType: String) => String
export const getDiscussionPathByDocType = (documentType) => {
  switch (documentType) {
    case DocumentTypes.STANDARD:
      return 'standardDiscussion';
    case DocumentTypes.NON_CONFORMITY:
      return 'nonConformityDiscussion';
    case DocumentTypes.RISK:
      return 'riskDiscussion';
    default:
      return '';
  }
};

// ({ orgSerialNumber: Number, discussionId: String, _id: String }: Object) => String
export const getMessageUrl = ({ orgSerialNumber, discussion = {}, _id }) => {
  const { linkedTo, documentType } = discussion;
  const params = { orgSerialNumber, urlItemId: linkedTo };
  const queryParams = { at: _id };
  const path = getDiscussionPathByDocType(documentType);

  return FlowRouter.path(
    path,
    params,
    queryParams,
  );
};

// ({ file: Document, text: String }: Object) => Object
export const getMessageTextData = ({ file, text }) => {
  if (file) {
    const { name, extension } = file;
    return { extension, text: name };
  }
  return { text: removeEmails(text) };
};

export default namedCompose('DashboardStatsMessageContainer')(
  onlyUpdateForKeys([
    '_id',
    'createdBy',
    'createdAt',
    'fileId',
    'discussionId',
    'type',
    'orgSerialNumber',
    'text',
  ]),
  composeWithTracker(({
    createdBy,
    fileId,
    discussionId,
    type,
    ...props
  }, onData) => {
    const file = type === MessageTypes.FILE ? Files.findOne({ _id: fileId }) : null;
    const user = Meteor.users.findOne({ _id: createdBy });
    const discussion = Discussions.findOne({ _id: discussionId });

    onData(null, {
      file,
      user,
      discussion,
      ...props,
    });
  }, {
    propsToWatch: ['createdBy', 'fileId', 'discussionId', 'type', 'orgSerialNumber'],
  }),
  withCurrentTime(60 * 1000),
  mapProps(({
    file,
    user,
    discussion,
    _id,
    orgSerialNumber,
    text,
    createdAt,
    currentTime,
  }) => ({
    url: getMessageUrl({ discussion, orgSerialNumber, _id }),
    fullName: getFullNameOrEmail(user) || '',
    timeString: moment(createdAt).from(currentTime, true),
    ...getMessageTextData({ file, text }),
  })),
)(DashboardStatsMessage);
