import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, noop } from 'plio-util';
import { Form } from 'reactstrap';
import { pure } from 'recompose';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateKeyActivity } from '../../../validation';
import CanvasForm from './CanvasForm';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import { getUserDefaultCanvasColor } from '../helpers';

const KeyActivityAddModal = ({
  isOpen,
  toggle,
  organizationId,
  onLink = noop,
}) => (
  <Query query={Queries.CANVAS_CURRENT_USER_INFO} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_KEY_ACTIVITY}>
        {createKeyActivity => (
          <EntityModalNext {...{ isOpen, toggle }}>
            <EntityModalForm
              keepDirtyOnReinitialize
              initialValues={{
                originator: getUserOptions(user),
                title: '',
                color: getUserDefaultCanvasColor(user),
                notes: '',
              }}
              onSubmit={(values) => {
                const errors = validateKeyActivity(values);
                if (errors) return errors;
                const {
                  title,
                  originator: { value: originatorId },
                  color,
                  notes,
                } = values;

                return createKeyActivity({
                  awaitRefetchQueries: true,
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
                    { query: Queries.KEY_ACTIVITIES, variables: { organizationId } },
                  ],
                }).then(({ data: { createKeyActivity: { keyActivity } } }) => {
                  onLink(keyActivity._id);
                  toggle();
                });
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Key activity" />
                  <EntityModalBody>
                    <Form onSubmit={handleSubmit}>
                      {/* hidden input is needed for return key to work */}
                      <input hidden type="submit" />
                      <CanvasForm {...{ organizationId }} />
                    </Form>
                  </EntityModalBody>
                </Fragment>
              )}
            </EntityModalForm>
          </EntityModalNext>
        )}
      </Mutation>
    )}
  </Query>
);

KeyActivityAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func,
};

export default pure(KeyActivityAddModal);
