import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import GoalForm from './GoalForm';
import { CardBlock } from '../../components';

import GoalMilestonesSubcardContainer from '../containers/GoalMilestonesSubcardContainer';
import GoalFilesSubcardContainer from '../containers/GoalFilesSubcardContainer';
import GoalRisksSubcardContainer from '../containers/GoalRisksSubcardContainer';
import GoalLessonsSubcardContainer from '../containers/GoalLessonsSubcardContainer';
import GoalNotifySubcardContainer from '../containers/GoalNotifySubcardContainer';
import GoalActionsSubcardContainer from '../containers/GoalActionsSubcardContainer';
import GoalEditForm from './GoalEditForm';
import GoalCompleteForm from './GoalCompleteForm';

const propTypes = {
  ...GoalForm.propTypes,
  status: PropTypes.number.isRequired,
  statusComment: PropTypes.string,
  onChangeStatusComment: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  completionComment: PropTypes.string,
  isCompleted: PropTypes.bool.isRequired,
  completedAt: PropTypes.number,
  completedBy: PropTypes.object,
  onChangeCompletedAt: PropTypes.func,
  onChangeCompletedBy: PropTypes.func,
  organizationId: PropTypes.string,
  onUndoCompletion: PropTypes.func,
};

export const GoalEdit = (props) => {
  const {
    onComplete,
    organizationId,
    _id: goalId,
    canEditGoals,
  } = props;
  return (
    <Fragment>
      <CardBlock>
        <GoalEditForm {...props} />
        {onComplete && <GoalCompleteForm {...{ onComplete }} />}
      </CardBlock>
      <GoalActionsSubcardContainer {...{ organizationId, goalId }} />
      <GoalMilestonesSubcardContainer {...{ goalId }} />
      {canEditGoals && (<GoalRisksSubcardContainer {...{ organizationId, goalId }} />)}
      <GoalLessonsSubcardContainer {...{ goalId }} />
      <GoalFilesSubcardContainer {...{ organizationId, goalId }} />
      <GoalNotifySubcardContainer {...{ organizationId, goalId }} />
    </Fragment>
  );
};

GoalEdit.propTypes = propTypes;

export default GoalEdit;
