import { setPropTypes, withState, withHandlers, flattenProp, onlyUpdateForKeys } from 'recompose';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { map, view } from 'ramda';

import { composeWithTracker, lenses } from '../../../../client/util';
import DashboardStatsOverdueActions from '../components/DashboardStatsOverdueActions';
import { namedCompose } from '../../helpers';
import {
  WORKSPACE_DEFAULTS,
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
  WorkItemStatuses,
} from '../../../../share/constants';
import { WorkItemSubs, CountSubs } from '../../../../startup/client/subsmanagers';
import Counter from '../../../../api/counter/client';
import { WorkItems } from '../../../../share/collections';

export default namedCompose('DashboardStatsOverdueActionsContainer')(
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
    const counterName = `work-items-overdue-count-${organizationId}`;
    const subs = [
      WorkItemSubs.subscribe('workItemsOverdue', organizationId, limit),
      CountSubs.subscribe('workItemsOverdueCount', counterName, organizationId),
    ];

    if (subs.every(sub => sub.ready())) {
      const query = {
        organizationId,
        status: WorkItemStatuses.OVERDUE,
        assigneeId: Meteor.userId(),
        isDeleted: { $ne: true },
      };
      const options = {
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
      const count = Counter.get(counterName);

      onData(null, {
        workItems,
        itemsPerRow,
        count,
        orgSerialNumber,
      });
    }
  }, {
    propsToWatch: ['isLimitEnabled', '_id', WorkspaceDefaultsTypes.DISPLAY_ACTIONS],
  }),
  composeWithTracker(({ workItems, ...props }, onData) => {
    const ids = map(view(lenses.linkedDoc._id), workItems);
    const subs = [
      Meteor.subscribe('nonConformitiesByIds', ids),
      Meteor.subscribe('risksByIds', ids),
      Meteor.subscribe('actionsByIds', ids),
    ];

    if (subs.every(sub => sub.ready())) {
      onData(null, { workItems, ...props });
    }

    return () => subs.forEach(sub => sub.stop());
  }, {
    propsToWatch: ['workItems'],
  }),
  withState('isOpen', 'setIsOpen', false),
  withHandlers({
    toggle: ({
      isOpen,
      setIsOpen,
      isLimitEnabled,
      setIsLimitEnabled,
    }) => () => {
      setIsLimitEnabled(!isLimitEnabled);
      setIsOpen(!isOpen);
    },
  }),
)(DashboardStatsOverdueActions);
