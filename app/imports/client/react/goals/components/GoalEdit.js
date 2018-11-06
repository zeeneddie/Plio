import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure } from 'recompose';
import { FormSpy } from 'react-final-form';
import { sort } from 'ramda';
import { bySerialNumber } from 'plio-util';

import { AWSDirectives, DocumentTypes } from '../../../../share/constants';
import { CardBlock, NotifySubcard, EntitiesField } from '../../components';
import GoalMilestonesSubcardContainer from '../containers/GoalMilestonesSubcardContainer';
import GoalLessonsSubcardContainer from '../containers/GoalLessonsSubcardContainer';
import GoalActionsSubcardContainer from '../containers/GoalActionsSubcardContainer';
import GoalEditForm from './GoalEditForm';
import CanvasFilesSubcard from '../../canvas/components/CanvasFilesSubcard';
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
  organization: { rkGuidelines } = {},
}) => (
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
      <GoalMilestonesSubcardContainer {...{ goalId }} />
      {canEditGoals && (
        <EntitiesField
          {...{ organizationId }}
          name="risks"
          render={RisksSubcard}
          onChange={save}
          guidelines={rkGuidelines}
          linkedTo={{ title, sequentialId }}
          risks={sort(bySerialNumber, risks)}
        />
      )}
      <GoalLessonsSubcardContainer {...{ goalId }} />
      <FormSpy subscription={{}}>
        {({ form }) => (
          <CanvasFilesSubcard
            {...{ organizationId }}
            documentId={goalId}
            onUpdate={({ variables: { input: { fileIds } } }) => {
              form.change('fileIds', fileIds);
              form.submit();
            }}
            slingshotDirective={AWSDirectives.GOAL_FILES}
            documentType={DocumentTypes.GOAL}
          />
        )}
      </FormSpy>
      <NotifySubcard
        {...{ organizationId }}
        documentId={goalId}
        onChange={save}
      />
    </Fragment>
  </Fragment>
);

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
};

export default pure(GoalEdit);
