import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { pure } from 'recompose';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions } from 'plio-util';
import { pick } from 'ramda';

import { ActionPlanOptions } from '../../../../share/constants';
import { validateAction, createFormError } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const ActionAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  type,
  linkedTo,
  documentType,
  refetchQueries,
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
        {...{ refetchQueries }}
        mutation={Mutations.CREATE_ACTION}
        children={noop}
      />,
      <Mutation
        {...{ refetchQueries }}
        mutation={Mutations.LINK_DOC_TO_ACTION}
        children={noop}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([{ data: { user } }, createAction, linkDocToAction]) => renderComponent({
      ...props,
      organizationId,
      isOpen,
      toggle,
      linkedTo,
      initialValues: {
        active: 0,
        owner: getUserOptions(user),
        toBeCompletedBy: getUserOptions(user),
        planInPlace: ActionPlanOptions.NO,
        // TODO: Update based on linked documents like creation modal?
        completionTargetDate: moment().add(1, 'days').toDate(),
      },
      onSubmit: (values) => {
        const {
          active,
          title = '',
          description = '',
          planInPlace,
          completionTargetDate,
          owner: { value: ownerId } = {},
          toBeCompletedBy: { value: toBeCompletedBy } = {},
          action: existingAction = {},
        } = values;

        if (active === 1) {
          if (!existingAction.value) return createFormError('Action required');
          return linkDocToAction({
            variables: {
              input: {
                _id: existingAction.value,
                ...pick(['documentId', 'documentType'], linkedTo),
              },
            },
          }).then(toggle || noop);
        }

        const errors = validateAction(values);
        if (errors) return errors;

        return createAction({
          variables: {
            input: {
              title,
              description,
              planInPlace,
              completionTargetDate,
              organizationId,
              ownerId,
              type,
              linkedTo: pick(['documentId', 'documentType'], linkedTo),
              toBeCompletedBy,
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
  type: PropTypes.string.isRequired,
  documentType: PropTypes.string,
  linkedTo: PropTypes.object,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onLink: PropTypes.func,
  refetchQueries: PropTypes.func,
};

export default pure(ActionAddContainer);
