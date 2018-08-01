import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { EntityModal } from '../../components';
import KeyPartnerForm from './KeyPartnerForm';
import { handleGQError } from '../../../../api/handleGQError';

const getInitialValues = (keyPartner, data) => compose(
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'criticality',
    'levelOfSpend',
    'notes',
  ]),
  pathOr(keyPartner, repeat('keyPartner', 2)),
)(data);

const KeyPartnerAddModal = ({
  isOpen,
  toggle,
  organizationId,
  keyPartner,
}) => (
  <Query query={Queries.KEY_PARTNER_CARD} variables={{ _id: keyPartner._id }} skip={!isOpen}>
    {({ data, ...query }) => (
      <Mutation mutation={Mutations.UPDATE_KEY_PARTNER}>
        {(updateKeyPartner, mutation) => (
          <EntityModal
            {...{ isOpen, toggle }}
            loading={query.loading || mutation.loading}
            error={handleGQError(query.error || mutation.error)}
            title="Key partner"
            initialValues={getInitialValues(keyPartner, data)}
          >
            <KeyPartnerForm
              {...{ organizationId }}
              save={({
                title,
                originator = {},
                color = {},
                criticality = {},
                levelOfSpend = {},
                notes,
              }) => updateKeyPartner({
                variables: {
                  input: {
                    title,
                    notes,
                    _id: keyPartner._id,
                    originatorId: originator.value,
                    color: color.hex ? color.hex.toUpperCase() : undefined,
                    criticality: criticality.value,
                    levelOfSpend: levelOfSpend.value,
                  },
                },
              })}
            />
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
  keyPartner: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default pure(KeyPartnerAddModal);
