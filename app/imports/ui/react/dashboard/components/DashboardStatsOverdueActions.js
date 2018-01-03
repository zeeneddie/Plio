import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { compose, pluck, join } from 'ramda';

import { DashboardStatsExpandable } from '../../components';
import {
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';

const DashboardStatsOverdueActions = ({
  count,
  items,
  itemsPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES],
}) => (
  <DashboardStatsExpandable
    items={items}
    itemsPerRow={itemsPerRow}
    render={({ items }) => (
      <div key={compose(join(' '), pluck('_id'))(items)}>
        hello world
      </div>
    )}
  >
    {pluralize('overdue work item', count, true)}
  </DashboardStatsExpandable>
);

DashboardStatsOverdueActions.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemsPerRow: PropTypes.number.isRequired,
};

export default DashboardStatsOverdueActions;
