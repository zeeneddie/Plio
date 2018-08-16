import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, convertDocumentOptions } from 'plio-util';

import { CanvasColors, CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModalNext } from '../../components';
import ValuePropositionForm from './ValuePropositionForm';
import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { validateValueProposition } from '../../../validation';

const ValuePropositionAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_VALUE_PROPOSITION}>
        {createValueProposition => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            label="Value proposition"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: CanvasColors.INDIGO,
              matchedTo: OptionNone,
              notes: '',
            }}
            onSubmit={(values) => {
              const errors = validateValueProposition(values);

              if (errors) return errors;

              const {
                title,
                originator: { value: originatorId },
                color,
                matchedTo,
                notes,
              } = values;

              return createValueProposition({
                variables: {
                  input: {
                    organizationId,
                    title,
                    originatorId,
                    color,
                    notes,
                    matchedTo: convertDocumentOptions({
                      documentType: CanvasTypes.CUSTOMER_SEGMENT,
                    }, matchedTo),
                  },
                },
                refetchQueries: [
                  { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                ],
              }).then(toggle);
            }}
          >
            <ValuePropositionForm {...{ organizationId }} />
          </EntityModalNext>
        )}
      </Mutation>
    )}
  </Query>
);

ValuePropositionAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default ValuePropositionAddModal;
