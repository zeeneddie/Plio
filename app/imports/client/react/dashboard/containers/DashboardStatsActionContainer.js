import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { onlyUpdateForKeys, mapProps } from 'recompose';
import moment from 'moment-timezone';
import { pick } from 'ramda';

import { namedCompose } from '../../helpers';
import { DashboardStatsAction } from '../components';
import { composeWithTracker } from '../../../util';
import { getLinkedDoc, getQueryParams } from '../../../../api/work-items/helpers';
import { Label } from '../../components';

export default namedCompose('DashboardStatsActionContainer')(
  onlyUpdateForKeys([
    'linkedDoc',
    'orgSerialNumber',
    '_id',
    'isCompleted',
    'assigneeId',
    'targetDate',
  ]),
  composeWithTracker(({
    linkedDoc,
    orgSerialNumber,
    _id,
    isCompleted,
    assigneeId,
    targetDate,
  }, onData) => {
    const userId = Meteor.userId();
    const { title, sequentialId } = getLinkedDoc(linkedDoc) || {};
    const children = (
      <React.Fragment>
        <Label names="danger">
          {sequentialId}
        </Label>
        {title}
      </React.Fragment>
    );
    const params = { orgSerialNumber, workItemId: _id };
    const queryParams = getQueryParams({ isCompleted, assigneeId }, userId)(userId);
    const href = FlowRouter.path('workInboxItem', params, queryParams);
    const time = moment(targetDate).from(new Date(), true);
    onData(null, {
      href,
      children,
      time,
    });
  }, {
    propsToWatch: [
      'linkedDoc',
      'orgSerialNumber',
      'isCompleted',
      'assigneeId',
      'targetDate',
    ],
  }),
  mapProps(pick(['href', 'children', 'time'])),
)(DashboardStatsAction);
