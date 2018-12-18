import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure } from 'recompose';
import { sort } from 'ramda';
import { bySerialNumber, byCompletionTargetDate } from 'plio-util';

import { AWSDirectives, DocumentTypes } from '../../../../share/constants';
import { CardBlock, NotifySubcard, EntitiesField, RelationsAdapter } from '../../components';
import MilestonesSubcard from '../../milestones/components/MilestonesSubcard';
import GoalLessonsSubcardContainer from '../containers/GoalLessonsSubcardContainer';
import GoalActionsSubcardContainer from '../containers/GoalActionsSubcardContainer';
import GoalEditForm from './GoalEditForm';
import FilesSubcardContainer from '../../canvas/components/FilesSubcardContainer';
import RisksSubcard from '../../risks/components/RisksSubcard';

export const GoalEdit = ({
  status,
  organizationId,
  sequentialId,
  title,
  save,
  _id: goalId,
  canEditGoals,
  risks,
  milestones,
  organization: { rkGuidelines } = {},
  refetchQueries,
}) => {
  const linkedTo = { _id: goalId, title, sequentialId };

  return (
    <Fragment>
      <CardBlock>
        <GoalEditForm
          {...{
            status,
            organizationId,
            sequentialId,
            save,
          }}
        />
      </CardBlock>
      <Fragment>
        <GoalActionsSubcardContainer {...{ organizationId, goalId }} />
        <RelationsAdapter
          {...{ refetchQueries, goalId, organizationId }}
          documentId={goalId}
          documentType={DocumentTypes.GOAL}
          relatedDocumentType={DocumentTypes.MILESTONE}
          component={MilestonesSubcard}
          milestones={sort(byCompletionTargetDate, milestones)}
        />
        {canEditGoals && (
          <RelationsAdapter
            {...{ organizationId, refetchQueries, linkedTo }}
            documentId={goalId}
            documentType={DocumentTypes.GOAL}
            relatedDocumentType={DocumentTypes.RISK}
            render={RisksSubcard}
            guidelines={rkGuidelines}
            risks={sort(bySerialNumber, risks)}
          />
        )}
        <GoalLessonsSubcardContainer {...{ goalId }} />
        <EntitiesField
          {...{ organizationId }}
          name="files"
          render={props => <FilesSubcardContainer {...props} />}
          documentId={goalId}
          onChange={save}
          slingshotDirective={AWSDirectives.GOAL_FILES}
          documentType={DocumentTypes.GOAL}
        />
        <NotifySubcard
          {...{ organizationId }}
          documentId={goalId}
          onChange={save}
        />
      </Fragment>
    </Fragment>
  );
};

GoalEdit.propTypes = {
  _id: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  organizationId: PropTypes.string,
  title: PropTypes.string.isRequired,
  sequentialId: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
  canEditGoals: PropTypes.bool,
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  organization: PropTypes.shape({
    rkGuidelines: PropTypes.object,
  }).isRequired,
  milestones: PropTypes.arrayOf(PropTypes.object).isRequired,
  refetchQueries: PropTypes.func,
};

export default pure(GoalEdit);
