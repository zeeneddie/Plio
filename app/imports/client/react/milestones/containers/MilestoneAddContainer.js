import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { noop, getEntityOptions } from 'plio-util';
import moment from 'moment';

import { validateMilestone } from '../../../validation';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { renderComponent, Composer } from '../../helpers';

const MilestoneAddContainer = ({
  goalId,
  organizationId,
  toggle,
  isOpen,
  onLink = noop,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.DASHBOARD_GOAL}
        variables={{ _id: goalId }}
        skip={!isOpen}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_MILESTONE}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([{ data: { goal: { goal } = {} } }, createMilestone]) => renderComponent({
      ...props,
      organizationId,
      toggle,
      isOpen,
      initialValues: {
        title: '',
        description: '',
        completionTargetDate: moment().add(1, 'week').toDate(),
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
        })
          .then(({ data: { createMilestone: { milestone } } }) => onLink(milestone._id))
          .then(toggle || noop);
      },
    })}
  </Composer>
);

MilestoneAddContainer.propTypes = {
  goalId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  onLink: PropTypes.func,
};

export default MilestoneAddContainer;
