import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions } from 'plio-util';

import { GoalColors, GoalPriorities } from '../../../../share/constants';
import { validateGoal, createFormError } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const GoalAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  onLink = noop,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.CURRENT_USER_FULL_NAME}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_GOAL}
        refetchQueries={() => [
          Queries.DASHBOARD_GOALS.name,
          Queries.GOAL_LIST.name,
        ]}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([{ data: { user } }, createGoal]) => renderComponent({
      ...props,
      organizationId,
      isOpen,
      toggle,
      initialValues: {
        active: 0,
        title: '',
        description: '',
        owner: getUserOptions(user),
        startDate: new Date(),
        endDate: null,
        priority: GoalPriorities.MINOR,
        color: GoalColors.INDIGO,
      },
      onSubmit: (values) => {
        const {
          active,
          title,
          description = '',
          owner: { value: ownerId } = {},
          startDate,
          endDate,
          priority,
          color,
          goal: existingGoal = {},
        } = values;

        if (active === 1) {
          if (!existingGoal.value) return createFormError('Goal required');
          return onLink(existingGoal.value).then(toggle || noop);
        }

        const errors = validateGoal(values);
        if (errors) return errors;

        return createGoal({
          variables: {
            input: {
              title,
              description,
              startDate,
              endDate,
              priority,
              color,
              organizationId,
              ownerId,
            },
          },
        }).then(({ data: { createGoal: { goal } } }) => {
          onLink(goal._id);
          if (toggle) toggle();
        });
      },
    })}
  </Composer>
);

GoalAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onLink: PropTypes.func,
};

export default React.memo(GoalAddContainer);
