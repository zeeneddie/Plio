import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';

import { CanvasColors, CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModal } from '../../components';
import ValuePropositionForm from './ValuePropositionForm';
import { ApolloFetchPolicies } from '../../../../api/constants';

const ValuePropositionAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_VALUE_PROPOSITION}>
        {createValueProposition => (
          <EntityModal
            {...{ isOpen, toggle }}
            title="Value proposition"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: CanvasColors.INDIGO,
              matchedTo: { label: 'None', value: undefined },
              notes: '',
            }}
            onSave={({
              title,
              originator: { value: originatorId },
              color,
              notes,
              matchedTo,
            }) => {
              if (!title) throw new Error('title is required');

              return createValueProposition({
                variables: {
                  input: {
                    organizationId,
                    title,
                    originatorId,
                    color,
                    notes,
                    matchedTo: matchedTo.value ? {
                      documentId: matchedTo.value,
                      documentType: CanvasTypes.CUSTOMER_SEGMENT,
                    } : undefined,
                  },
                },
                refetchQueries: [
                  { query: Queries.VALUE_PROPOSITION_LIST, variables: { organizationId } },
                  { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                ],
              }).then(toggle);
            }}
          >
            <ValuePropositionForm {...{ organizationId }} />
          </EntityModal>
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
