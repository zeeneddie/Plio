import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { map } from 'ramda';
import { onlyUpdateForKeys } from 'recompose';
import { joinIds } from 'plio-util';

import { DashboardStatsExpandable, IconLoading } from '../../components';
import {
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';
import { DashboardStatsActionContainer } from '../containers';

const enhance = onlyUpdateForKeys([
  'count',
  'workItems',
  'orgSerialNumber',
  'itemsPerRow',
  'isOpen',
  'loading',
]);

export const DashboardStatsOverdueItems = ({
  count,
  workItems,
  orgSerialNumber,
  itemsPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES],
  toggle,
  isOpen,
  loading,
}) => (
  <DashboardStatsExpandable
    total={count}
    items={workItems}
    renderIcon={loading ? () => <IconLoading /> : undefined}
    render={({ items }) => (
      <div key={joinIds(items)}>
        {map(item => (
          <DashboardStatsActionContainer key={item._id} {...{ ...item, orgSerialNumber }} />
        ), items)}
      </div>
    )}
    {...{ toggle, isOpen, itemsPerRow }}
  >
    {pluralize('overdue work item', count, true)}
  </DashboardStatsExpandable>
);

DashboardStatsOverdueItems.propTypes = {
  workItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemsPerRow: PropTypes.number.isRequired,
  orgSerialNumber: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
};

export default enhance(DashboardStatsOverdueItems);
