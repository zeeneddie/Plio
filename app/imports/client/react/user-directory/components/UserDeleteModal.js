import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Form, FormGroup } from 'reactstrap';
import { ApolloProvider, Mutation } from 'react-apollo';
import { pure } from 'recompose';
import { noop } from 'plio-util';
import { reject, whereEq } from 'ramda';

import {
  EntityModalNext,
  EntityModalForm,
  EntityModalHeader,
  EntityModalBody,
  UserSelectInput,
  CardBlock,
  FlowRouterContext,
} from '../../components';
import { client } from '../../../apollo';
import { swal } from '../../../util';
import { removeUser } from '../../../../api/organizations/methods';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';

const UserDeleteModal = ({
  isOpen,
  toggle,
  organizationId,
  userId,
  userName,
  onSuccess = noop,
}) => (
  <ApolloProvider {...{ client }}>
    <FlowRouterContext getParam="orgSerialNumber">
      {({ orgSerialNumber, router }) => (
        <Mutation mutation={Mutations.REASSIGN_USER_OWNERSHIP}>
          {reassignOwnership => (
            <EntityModalNext {...{ isOpen, toggle }}>
              <EntityModalForm
                keepDirtyOnReinitialize
                initialValues={{ user: undefined }}
                // BUG: when clicking on "Delete" button in modal and then on "Cancel" in alert
                // right modal button will permanently show saving state and disable the button.
                // The user then must close the modal and reopen it to proceed
                // swal doesn't call callback on cancel for some reason
                onSubmit={({ user: { value } = {} }) => swal.promise({
                  text: `${userName} will be removed from the organization`,
                  confirmButtonText: 'remove',
                  successTitle: 'Removed!',
                  successText: `${userName} has been removed from this organization`,
                }, () => reassignOwnership({
                  variables: {
                    input: {
                      organizationId,
                      userId,
                      ownerId: value,
                    },
                  },
                })
                .then(() => new Promise((resolve, rej) => {
                  removeUser.call({ organizationId, userId }, (err, res) => {
                    if (err) rej(err);
                    resolve(res);
                  });
                }))
                // manually refetch query
                .then(() => client.query({
                  query: Queries.ORGANIZATION_USERS,
                  variables: { organizationId },
                }))
                .then(toggle)
                .then(() => router.go('userDirectoryPage', { orgSerialNumber }))
                .then(onSuccess))}
              >
                {({ handleSubmit }) => (
                  <Fragment>
                    <EntityModalHeader label="Delete user" rightButtonLabel="Delete" />
                    <EntityModalBody>
                      <Form onSubmit={handleSubmit}>
                        {/* hidden input is needed for return key to work */}
                        <input hidden type="submit" />
                        <CardBlock>
                          <FormGroup>
                            {organizationId && (
                              <UserSelectInput
                                {...{ organizationId }}
                                name="user"
                                placeholder={
                                  `Select user to take on ${userName} owner responsibilities`
                                }
                                transformOptions={reject(whereEq({ value: userId }))}
                              />
                            )}
                          </FormGroup>
                        </CardBlock>
                      </Form>
                    </EntityModalBody>
                  </Fragment>
                )}
              </EntityModalForm>
            </EntityModalNext>
          )}
        </Mutation>
      )}
    </FlowRouterContext>
  </ApolloProvider>
);

UserDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string,
  userId: PropTypes.string.isRequired,
  userName: PropTypes.string,
  onSuccess: PropTypes.func,
};

export default pure(UserDeleteModal);
