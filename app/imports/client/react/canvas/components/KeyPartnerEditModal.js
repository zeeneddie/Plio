import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateKeyPartner } from '../../../validation';
import { EntityModalNext } from '../../components';
import { WithState, Composer } from '../../helpers';
import KeyPartnerForm from './KeyPartnerForm';

const getKeyPartner = pathOr({}, repeat('keyPartner', 2));
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'criticality',
    'levelOfSpend',
    'notes',
  ]),
  getKeyPartner,
);

const KeyPartnerEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            query={Queries.KEY_PARTNER_CARD}
            variables={{ _id }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_KEY_PARTNER} children={noop} />,
          <Mutation mutation={Mutations.DELETE_KEY_PARTNER} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateKeyPartner, deleteKeyPartner]) => (
          <EntityModalNext
            {...{ isOpen, toggle, initialValues }}
            isEditMode
            label="Key partner"
            loading={query.loading}
            error={query.error}
            guidance="Hello World"
            validate={validateKeyPartner}
            onDelete={() => {
              const { title } = getKeyPartner(data);
              swal.promise(
                {
                  text: `The key partner "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The key partner "${title}" was deleted successfully.`,
                },
                () => deleteKeyPartner({
                  variables: { input: { _id } },
                  refetchQueries: [
                    { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                  ],
                }).then(toggle),
              );
            }}
            onSubmit={(values, form) => {
              const currentValues = getInitialValues(data);
              const isDirty = diff(values, currentValues);

              if (!isDirty) return undefined;

              const {
                title,
                originator,
                color,
                criticality,
                levelOfSpend,
                notes = '', // final form sends undefined value instead of an empty string
              } = values;

              return updateKeyPartner({
                variables: {
                  input: {
                    _id,
                    title,
                    notes,
                    color,
                    criticality,
                    levelOfSpend,
                    originatorId: originator.value,
                  },
                },
              }).then(noop).catch((err) => {
                form.reset(currentValues);
                throw err;
              });
            }}
          >
            {({ form: { form } }) => (
              <KeyPartnerForm {...{ organizationId }} save={form.submit} />
            )}
          </EntityModalNext>
        )}
      </Composer>
    )}
  </WithState>
);

KeyPartnerEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(KeyPartnerEditModal);
