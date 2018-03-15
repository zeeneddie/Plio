import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import DashboardDeletedItem from '../../dashboard/components/DashboardDeletedItem';
import { DashboardStats } from '../../components';

const CompletedDeletedGoals = ({
  goals,
  totalCount,
  loadAllDeletedGoals,
  showLatestItems,
  isAllBtn,
  moreItemsCount,
  ...restProps
}) => {
  if (totalCount === 0) {
    return null;
  }
  return (
    <div>
      <hr />
      <DashboardStats.Title>
        {totalCount} completed & deleted {pluralize('goal', totalCount)}
      </DashboardStats.Title>
      <div>
        {goals.map(goal => (
          <DashboardDeletedItem
            key={`removed-goal-${goal._id}`}
            {...{
              ...goal,
              ...restProps,
            }}
          />
        ))}
      </div>
      {isAllBtn && (
        <a href="" onClick={loadAllDeletedGoals}>
          View all items
          <span className="text-muted"> ({moreItemsCount} more)</span>
        </a>
      )}
      {showLatestItems && (
        <a href="" onClick={showLatestItems}>
          View latest items
        </a>
      )}
    </div>
  );
};

CompletedDeletedGoals.propTypes = {
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalCount: PropTypes.number.isRequired,
  moreItemsCount: PropTypes.number.isRequired,
  isAllBtn: PropTypes.bool.isRequired,
  loadAllDeletedGoals: PropTypes.func,
  showLatestItems: PropTypes.func,
};

export default CompletedDeletedGoals;
