import { setPropTypes, withState, withHandlers, flattenProp, onlyUpdateForKeys } from 'recompose';
import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { map, view } from 'ramda';
import { lenses } from 'plio-util';

import { composeWithTracker } from '../../../../client/util';
import DashboardStatsOverdueItems from '../components/DashboardStatsOverdueItems';
import { namedCompose } from '../../helpers';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
  WorkItemStatuses,
} from '../../../../share/constants';
import {
  WorkItemSubs,
  CountSubs,
  BackgroundSubs,
} from '../../../../startup/client/subsmanagers';
import Counter from '../../../../api/counter/client';
import { WorkItems } from '../../../../share/collections';

export const getCounterName = organizationId => `work-items-overdue-count-${organizationId}`;

export default namedCompose('DashboardStatsOverdueItemsContainer')(
  setPropTypes({
    organization: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      serialNumber: PropTypes.number.isRequired,
      [WORKSPACE_DEFAULTS]: PropTypes.shape({
        [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: PropTypes.number,
      }).isRequired,
    }).isRequired,
  }),
  flattenProp('organization'),
  flattenProp(WORKSPACE_DEFAULTS),
  onlyUpdateForKeys(['_id', 'serialNumber', WorkspaceDefaultsTypes.DISPLAY_ACTIONS]),
  withState('isLimitEnabled', 'setIsLimitEnabled', true),
  composeWithTracker(({
    isLimitEnabled,
    _id: organizationId,
    serialNumber: orgSerialNumber,
    [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]:
      itemsPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_ACTIONS],
  }, onData) => {
    const limit = isLimitEnabled ? itemsPerRow : 0;
    const workItemsSub = WorkItemSubs.subscribe('workItemsOverdue', organizationId, limit);
    CountSubs.subscribe('workItemsOverdueCount', getCounterName(organizationId), organizationId);

    const props = {
      itemsPerRow,
      organizationId,
      orgSerialNumber,
      limit,
    };

    if (workItemsSub.ready()) {
      onData(null, { ...props, loading: false });
    } else {
      onData(null, { ...props, loading: true });
    }
  }, {
    propsToWatch: ['isLimitEnabled', '_id', WorkspaceDefaultsTypes.DISPLAY_ACTIONS],
  }),
  composeWithTracker(({
    limit,
    organizationId,
    ...props
  }, onData) => {
    const query = {
      organizationId,
      status: WorkItemStatuses.OVERDUE,
      assigneeId: Meteor.userId(),
      isDeleted: { $ne: true },
    };
    const options = {
      limit,
      sort: {
        targetDate: -1, // New overdue items first
      },
      fields: {
        _id: 1,
        linkedDoc: 1,
        targetDate: 1,
        type: 1,
        isCompleted: 1,
        assigneeId: 1,
      },
    };
    const workItems = WorkItems.find(query, options).fetch();
    const linkedDocIds = map(view(lenses.linkedDoc._id), workItems);
    const count = Counter.get(getCounterName(organizationId));

    onData(null, {
      workItems,
      linkedDocIds,
      count,
      organizationId,
      ...props,
    });
  }),
  composeWithTracker(({
    workItems,
    linkedDocIds,
    ...props
  }, onData) => {
    BackgroundSubs.subscribe('nonConformitiesByIds', linkedDocIds);
    BackgroundSubs.subscribe('risksByIds', linkedDocIds);
    BackgroundSubs.subscribe('actionsByIds', linkedDocIds);

    onData(null, { workItems, ...props });
  }, {
    propsToWatch: ['linkedDocIds'],
  }),
  withState('isOpen', 'setIsOpen', false),
  withHandlers({
    toggle: ({
      isOpen,
      setIsOpen,
      isLimitEnabled,
      setIsLimitEnabled,
    }) => () => setIsOpen(!isOpen, () => setIsLimitEnabled(!isLimitEnabled)),
  }),
)(({ workItems, ...props }) => !!workItems.length && (
  <div>
    <hr />
    <DashboardStatsOverdueItems {...{ workItems, ...props }} />
  </div>
));
