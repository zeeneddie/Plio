import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Query, Mutation } from 'react-apollo';
import { noop } from 'plio-util';

import { getActionFormInitialState } from '../helpers';
import { validateAction, createFormError } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const ActionAddContainer = ({
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
        mutation={Mutations.CREATE_ACTION}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([{ data: { user } }, createAction]) => renderComponent({
      ...props,
      organizationId,
      isOpen,
      toggle,
      initialValues: getActionFormInitialState(user),
      onSubmit: (values) => {
        const {
          active,
          title = '',
          description = '',
          toBeCompletedBy,
          planInPlace,
          completionTargetDate,
          owner: { value: ownerId } = {},
          existingAction,
        } = values;

        if (active === 1) {
          if (!existingAction.value) return createFormError('Action required');
          return onLink(existingAction.value).then(toggle || noop);
        }

        const errors = validateAction(values);
        if (errors) return errors;

        return createAction({
          variables: {
            input: {
              title,
              description,
              toBeCompletedBy,
              planInPlace,
              completionTargetDate,
              organizationId,
              ownerId,
            },
          },
        }).then(({ data: { createAction: { action } } }) => {
          onLink(action._id);
          if (toggle) toggle();
        });
      },
    })}
  </Composer>
);

ActionAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onLink: PropTypes.func,
};

export default pure(ActionAddContainer);
