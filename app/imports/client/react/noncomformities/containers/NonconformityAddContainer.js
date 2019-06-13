import React from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions } from 'plio-util';
import { pluck } from 'ramda';

import { validateNonConformity, createFormError } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ProblemMagnitudes, ProblemTypes } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';

const NonconformityAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  type,
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
        mutation={Mutations.CREATE_NONCONFORMITY}
        children={noop}
        refetchQueries={() => [
          type === ProblemTypes.NON_CONFORMITY
            ? { query: Queries.NONCONFORMITY_LIST, variables: { organizationId } }
            : { query: Queries.POTENTIAL_GAIN_LIST, variables: { organizationId } },
        ]}
      />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([{ data: { user } }, createNonconformity]) => renderComponent({
      ...props,
      organizationId,
      isOpen,
      toggle,
      initialValues: {
        active: 0,
        title: '',
        description: '',
        standardsIds: [],
        owner: getUserOptions(user),
        originator: getUserOptions(user),
        magnitude: ProblemMagnitudes.MINOR,
      },
      onSubmit: (values) => {
        const {
          active,
          title,
          magnitude,
          standards,
          description = '',
          owner: { value: ownerId } = {},
          originator: { value: originatorId } = {},
          nonconformity: existingNonconformity = {},
        } = values;

        if (active === 1) {
          if (!existingNonconformity.value) return createFormError('Nonconformity required');
          return onLink(existingNonconformity.value).then(toggle || noop);
        }

        const errors = validateNonConformity(values);
        if (errors) return errors;

        return createNonconformity({
          variables: {
            input: {
              title,
              description,
              organizationId,
              ownerId,
              originatorId,
              magnitude,
              type,
              standardsIds: pluck('value', standards || []),
            },
          },
        }).then(({ data: { createNonconformity: { nonconformity } } }) => {
          onLink(nonconformity._id);
          if (toggle) toggle();
        });
      },
    })}
  </Composer>
);

NonconformityAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  onLink: PropTypes.func,
};

export default pure(NonconformityAddContainer);
