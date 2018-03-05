import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import pluralize from 'pluralize';
import { joinIds } from 'plio-util';

import {
  DashboardStatsExpandable,
  IconLoading,
  PlusButton,
  GoalsChart,
} from '../../components';
import {
  GoalAddModalContainer,
  GoalEditModalContainer,
  CompletedDeletedGoalsContainer,
} from '../../goals/containers';

const DashboardGoals = ({
  totalCount,
  goals,
  toggle,
  isOpen,
  loading,
  isAddModalOpen,
  toggleAddModal,
  userId,
  organizationId,
  isEditModalOpen,
  toggleEditModal,
  deletedItemsPerRow,
}) => (
  <DashboardStatsExpandable
    items={goals}
    total={totalCount}
    itemsPerRow={goals.length}
    renderIcon={loading ? () => <IconLoading /> : undefined}
    render={({ items }) => (
      <Fragment>
        {!!items.length && (
          <GoalsChart
            key={joinIds(items)}
            goals={items}
          />
        )}
        <CompletedDeletedGoalsContainer
          {...{
            organizationId,
            deletedItemsPerRow,
          }}
        />
      </Fragment>
    )}
    {...{ toggle, isOpen }}
  >
    <PlusButton size="1" onClick={toggleAddModal} />
    {goals.length
      ? pluralize('goal', totalCount || goals.length, true)
      : 'Add a key goal'}
    <GoalAddModalContainer
      isOpen={isAddModalOpen}
      toggle={toggleAddModal}
      ownerId={userId}
      {...{ organizationId }}
    />
    {!!goals.length && (
      <GoalEditModalContainer
        isOpen={isEditModalOpen}
        toggle={toggleEditModal}
        {...{ organizationId }}
      />
    )}
  </DashboardStatsExpandable>
);

DashboardGoals.propTypes = {
  totalCount: PropTypes.number.isRequired,
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isAddModalOpen: PropTypes.bool.isRequired,
  toggleAddModal: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  userId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  isEditModalOpen: PropTypes.bool.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
  deletedItemsPerRow: PropTypes.number,
};

export default DashboardGoals;
