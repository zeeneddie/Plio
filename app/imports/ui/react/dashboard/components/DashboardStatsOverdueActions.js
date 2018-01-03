import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { map } from 'ramda';
import { onlyUpdateForKeys } from 'recompose';

import { DashboardStatsExpandable } from '../../components';
import {
  WorkspaceDefaults,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';
import { DashboardStatsActionContainer } from '../containers';
import { joinIds } from '../../../../client/util';

const enhance = onlyUpdateForKeys(['count', 'workItems', 'orgSerialNumber', 'itemsPerRow']);

export const DashboardStatsOverdueActions = ({
  count,
  workItems,
  orgSerialNumber,
  itemsPerRow = WorkspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES],
}) => (
  <DashboardStatsExpandable
    items={workItems}
    itemsPerRow={itemsPerRow}
    render={({ items }) => (
      <div key={joinIds(items)}>
        {map(item => (
          <DashboardStatsActionContainer key={item._id} {...{ ...item, orgSerialNumber }} />
        ), workItems)}
      </div>
    )}
  >
    {pluralize('overdue work item', count, true)}
  </DashboardStatsExpandable>
);

DashboardStatsOverdueActions.propTypes = {
  workItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemsPerRow: PropTypes.number.isRequired,
  orgSerialNumber: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

export default enhance(DashboardStatsOverdueActions);
