import React from 'react';
import { mapProps } from 'recompose';

import MessagesListHeader from '../../components/MessagesListHeader';
import { getStartedAtText, getStartedByText } from '/imports/api/messages/helpers';
import { transsoc } from '/imports/api/helpers';

export default mapProps(transsoc({
  startedBy: getStartedByText,
  startedAt: getStartedAtText
}))(MessagesListHeader);
