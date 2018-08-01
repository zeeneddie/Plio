import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';

import { CanvasColors, Criticality } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModal } from '../../components';
import KeyPartnerForm from './KeyPartnerForm';
import { ApolloFetchPolicies } from '../../../../api/constants';

const KeyPartnerAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_KEY_PARTNER}>
        {createKeyPartner => (
          <EntityModal
            {...{ isOpen, toggle }}
            title="Key partner"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: CanvasColors.INDIGO,
              criticality: Criticality.MEDIUM,
              levelOfSpend: Criticality.MEDIUM,
              notes: '',
            }}
            onSave={({
              title,
              originator: { value: originatorId },
              color,
              criticality,
              levelOfSpend,
              notes,
            }) => {
              if (!title) throw new Error('title is required');

              return createKeyPartner({
                variables: {
                  input: {
                    organizationId,
                    title,
                    originatorId,
                    color,
                    criticality,
                    levelOfSpend,
                    notes,
                  },
                },
                refetchQueries: [
                  { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                ],
              }).then(toggle);
            }}
          >
            <KeyPartnerForm {...{ organizationId }} />
          </EntityModal>
        )}
      </Mutation>
    )}
  </Query>
);

KeyPartnerAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default KeyPartnerAddModal;
