import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import { joinIds } from 'plio-util';

import DashboardDeletedItem from '../../dashboard/components/DashboardDeletedItem';
import { DashboardStatsExpandable, IconLoading } from '../../components';

const CompletedDeletedGoals = ({
  goals,
  totalCount,
  loading,
  isOpen,
  toggle,
  itemsPerRow,
  canRestore,
  onUndoCompletion,
  onRestore,
  onRemove,
}) => (
  <DashboardStatsExpandable
    {...{ isOpen, toggle, itemsPerRow }}
    items={goals}
    total={totalCount}
    renderIcon={loading ? () => <IconLoading /> : undefined}
    render={({ items }) => (
      <div key={joinIds(items)}>
        {items.map(item => (
          <DashboardDeletedItem
            {...{
              ...item,
              canRestore,
              onUndoCompletion,
              onRestore,
              onRemove,
            }}
            key={item._id}
          />
        ))}
      </div>
    )}
  >
    {totalCount} completed or deleted {pluralize('goal', totalCount)}
  </DashboardStatsExpandable>
);

CompletedDeletedGoals.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  itemsPerRow: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  canRestore: PropTypes.func.isRequired,
  onUndoCompletion: PropTypes.func,
  onRestore: PropTypes.func,
  onRemove: PropTypes.func,
};

export default CompletedDeletedGoals;
