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
import { EntityModalNext } from '../../components';
import { validateKeyResource } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import CanvasForm from './CanvasForm';

const getKeyResource = pathOr({}, repeat('keyResource', 2));
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'notes',
  ]),
  getKeyResource,
);

const KeyResourceEditModal = ({
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
            query={Queries.KEY_RESOURCE_CARD}
            variables={{ _id }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_KEY_RESOURCE} children={noop} />,
          <Mutation mutation={Mutations.DELETE_KEY_RESOURCE} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateKeyResource, deleteKeyResource]) => (
          <EntityModalNext
            {...{ isOpen, toggle, initialValues }}
            isEditMode
            loading={query.loading}
            error={query.error}
            label="Key resource"
            guidance="Key resource"
            validate={validateKeyResource}
            onDelete={() => {
              const { title } = getKeyResource(data);
              swal.promise(
                {
                  text: `The key resource "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The key resource "${title}" was deleted successfully.`,
                },
                () => deleteKeyResource({
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
                notes = '', // final form sends undefined value instead of an empty string
              } = values;

              return updateKeyResource({
                variables: {
                  input: {
                    _id,
                    title,
                    notes,
                    color,
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
              <CanvasForm {...{ organizationId }} save={form.submit} />
            )}
          </EntityModalNext>
        )}
      </Composer>
    )}
  </WithState>
);

KeyResourceEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(KeyResourceEditModal);
