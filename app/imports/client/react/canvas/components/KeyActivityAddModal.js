import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';

import { KeyPartnerColors } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModal } from '../../components';
import CanvasForm from './CanvasForm';
import { ApolloFetchPolicies } from '../../../../api/constants';

const KeyActivitiesAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CURRENT_USER_FULL_NAME} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_KEY_ACTIVITY}>
        {createKeyActivity => (
          <EntityModal
            {...{ isOpen, toggle }}
            title="Key activity"
            initialValues={{
              originator: getUserOptions(user),
              title: '',
              color: KeyPartnerColors.INDIGO,
              notes: '',
            }}
            onSave={({
              title,
              originator: { value: originatorId },
              color,
              notes,
            }) => {
              if (!title) throw new Error('title is required');

              return createKeyActivity({
                variables: {
                  input: {
                    organizationId,
                    title,
                    originatorId,
                    color,
                    notes,
                  },
                },
                refetchQueries: [
                  { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                ],
              }).then(toggle);
            }}
          >
            <CanvasForm {...{ organizationId }} />
          </EntityModal>
        )}
      </Mutation>
    )}
  </Query>
);

KeyActivitiesAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default KeyActivitiesAddModal;
