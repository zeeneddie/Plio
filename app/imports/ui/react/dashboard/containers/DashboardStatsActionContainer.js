import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { onlyUpdateForKeys, mapProps } from 'recompose';
import moment from 'moment-timezone';
import { pick } from 'ramda';

import { namedCompose } from '../../helpers';
import { DashboardStatsAction } from '../components';
import { composeWithTracker } from '../../../../client/util';
import { getLinkedDoc, getTypeText, getQueryParams } from '../../../../api/work-items/helpers';

export default namedCompose('DashboardStatsActionContainer')(
  onlyUpdateForKeys([
    'type',
    'linkedDoc',
    'orgSerialNumber',
    '_id',
    'isCompleted',
    'assigneeId',
    'targetDate',
  ]),
  composeWithTracker(({
    type,
    linkedDoc,
    orgSerialNumber,
    _id,
    isCompleted,
    assigneeId,
    targetDate,
  }, onData) => {
    const userId = Meteor.userId();
    const { title, sequentialId } = getLinkedDoc(linkedDoc) || {};
    const children = `${title} - ${getTypeText({ type, linkedDoc })} (${sequentialId})`;
    const params = { orgSerialNumber, workItemId: _id };
    const queryParams = getQueryParams({ isCompleted, assigneeId }, userId)(userId);
    const href = FlowRouter.path('workInboxItem', params, queryParams);
    const time = moment(targetDate).from(new Date(), true);
    onData(null, {
      href,
      children,
      time,
    });
  }),
  mapProps(pick(['href', 'children', 'time'])),
)(DashboardStatsAction);
