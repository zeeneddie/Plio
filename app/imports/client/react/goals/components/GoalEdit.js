import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure, withHandlers } from 'recompose';
import { sort, compose } from 'ramda';
import { bySerialNumber } from 'plio-util';

import { Query as Queries } from '../../../graphql';
import { AWSDirectives, DocumentTypes, ActionTypes } from '../../../../share/constants';
import { CardBlock, NotifySubcard, EntitiesField } from '../../components';
import GoalMilestonesSubcardContainer from '../containers/GoalMilestonesSubcardContainer';
import GoalLessonsSubcardContainer from '../containers/GoalLessonsSubcardContainer';
import GoalEditForm from './GoalEditForm';
import FilesSubcardContainer from '../../canvas/components/FilesSubcardContainer';
import RisksSubcard from '../../risks/components/RisksSubcard';
import ActionsSubcard from '../../actions/components/ActionsSubcard';

const enhance = compose(
  withHandlers({
    refetchQueries: ({ _id, organizationId }) => () => [
      {
        query: Queries.GOAL_CARD,
        variables: { _id, organizationId },
      },
    ],
  }),
  pure,
);

export const GoalEdit = ({
  status,
  organizationId,
  sequentialId,
  title,
  save,
  _id: goalId,
  canEditGoals,
  risks,
  actions,
  refetchQueries,
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
      <EntitiesField
        {...{ organizationId, refetchQueries }}
        name="actions"
        render={ActionsSubcard}
        onChange={save}
        newEntityTitle="New general action"
        newEntityButtonTitle="Add general action"
        type={ActionTypes.GENERAL_ACTION}
        documentType={DocumentTypes.GOAL}
        linkedTo={{ _id: goalId, title, sequentialId }}
        actions={sort(bySerialNumber, actions)}
      />
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

GoalEdit.propTypes = {
  _id: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  organizationId: PropTypes.string,
  title: PropTypes.string.isRequired,
  sequentialId: PropTypes.string.isRequired,
  save: PropTypes.func.isRequired,
  canEditGoals: PropTypes.bool,
  refetchQueries: PropTypes.func,
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(PropTypes.object).isRequired,
  organization: PropTypes.shape({
    rkGuidelines: PropTypes.object,
  }).isRequired,
};

export default enhance(GoalEdit);
