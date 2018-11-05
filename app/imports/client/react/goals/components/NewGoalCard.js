import PropTypes from 'prop-types';
import React from 'react';

import {
  CardBlock,
  FormField,
  NewExistingSwitchField,
  GoalSelectInput,
} from '../../components';
import GoalForm from './GoalForm';

const NewGoalCard = ({ organizationId, goalIds }) => (
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
          {...{ organizationId, goalIds }}
        />
      </FormField>
    </CardBlock>
  </NewExistingSwitchField>
);

NewGoalCard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  goalIds: PropTypes.array,
};

export default NewGoalCard;
