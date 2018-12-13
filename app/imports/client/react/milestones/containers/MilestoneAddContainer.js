import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { noop, getEntityOptions } from 'plio-util';

import { validateMilestone } from '../../../validation';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { renderComponent, Composer } from '../../helpers';

const MilestoneAddContainer = ({
  goalId,
  organizationId,
  toggle,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.DASHBOARD_GOAL}
        variables={{ _id: goalId }}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_MILESTONE}
        refetchQueries={() => [{
          query: Queries.GOAL_CARD,
          variables: { _id: goalId, organizationId },
        }]}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([{ data: { goal: { goal } = {} } }, createMilestone]) => renderComponent({
      ...props,
      organizationId,
      toggle,
      initialValues: {
        title: '',
        description: '',
        completionTargetDate: null,
        linkedTo: getEntityOptions(goal),
      },
      onSubmit: async (values) => {
        const errors = validateMilestone(values);

        if (errors) return errors;

        const {
          title,
          description = '',
          completionTargetDate,
        } = values;

        return createMilestone({
          variables: {
            input: {
              title,
              description,
              completionTargetDate,
              organizationId,
              linkedTo: goal._id,
            },
          },
        }).then(toggle || noop);
      },
    })}
  </Composer>
);

MilestoneAddContainer.propTypes = {
  goalId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  toggle: PropTypes.func,
};

export default MilestoneAddContainer;
