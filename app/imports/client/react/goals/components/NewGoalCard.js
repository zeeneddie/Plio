import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import { mapRejectedEntitiesByIdsToOptions } from 'plio-util';

import {
  CardBlock,
  FormField,
  NewExistingSwitchField,
  GoalSelectInput,
} from '../../components';
import GoalForm from './GoalForm';

const NewGoalCard = ({ organizationId, goalIds = [] }) => (
  <NewExistingSwitchField name="active">
    <CardBlock>
      <GoalForm {...{ organizationId }} />
    </CardBlock>
    <CardBlock>
      <FormField>
        Existing goal
        <GoalSelectInput
          name="goal"
          placeholder="Existing goal"
          transformOptions={({ data: { goals: { goals } } }) =>
            mapRejectedEntitiesByIdsToOptions(goalIds, goals)}
          {...{ organizationId }}
        />
      </FormField>
    </CardBlock>
  </NewExistingSwitchField>
);

NewGoalCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  goalIds: PropTypes.array,
};

export default pure(NewGoalCard);
