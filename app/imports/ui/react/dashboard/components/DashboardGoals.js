import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import pluralize from 'pluralize';
import { joinIds } from 'plio-util';

import {
  DashboardStatsExpandable,
  IconLoading,
  PlusButton,
} from '../../components';
import {
  GoalsChart,
  GoalAddModalContainer,
  GoalEditModalContainer,
  CompletedDeletedGoalsContainer,
} from '../../goals';

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
  timeScale,
  canEditGoals,
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
            {...{
              canEditGoals,
              timeScale,
              organizationId,
            }}
            key={joinIds(items)}
            goals={items}
          />
        )}
        <CompletedDeletedGoalsContainer
          {...{
            canEditGoals,
            organizationId,
            deletedItemsPerRow,
          }}
        />
      </Fragment>
    )}
    {...{ toggle, isOpen }}
  >
    {canEditGoals && <PlusButton size="1" onClick={toggleAddModal} />}
    {goals.length
      ? pluralize('goal', totalCount || goals.length, true)
      : 'Add a key goal'}
    {canEditGoals && (
      <GoalAddModalContainer
        isOpen={isAddModalOpen}
        toggle={toggleAddModal}
        ownerId={userId}
        {...{ organizationId }}
      />
    )}
    {!!goals.length && (
      <GoalEditModalContainer
        isOpen={isEditModalOpen}
        toggle={toggleEditModal}
        {...{ organizationId, canEditGoals }}
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
  timeScale: PropTypes.number.isRequired,
  canEditGoals: PropTypes.bool,
  deletedItemsPerRow: PropTypes.number,
};

export default DashboardGoals;
