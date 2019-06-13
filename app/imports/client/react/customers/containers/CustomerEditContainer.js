import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Query, Mutation, ApolloProvider } from 'react-apollo';
import { pick, prop, path } from 'ramda';
import diff from 'deep-diff';
import { noop } from 'plio-util';
import gql from 'graphql-tag';
import { SHA256 } from 'meteor/sha';

import { Mutation as Mutations } from '../../../graphql';
import renderComponent from '../../helpers/renderComponent';
import { client } from '../../../apollo';
import swal from '../../../util/swal';
import { ORG_DELETE } from '../../../../api/swal-params';
import { deleteCustomerOrganization } from '../../../../api/organizations/methods';

const getInitialValues = pick([
  'name',
  'serialNumber',
  'customerType',
  'signupPath',
]);

const query = gql`
  {
    user: me {
      _id
      isPlioAdmin
    }
  }
`;

const CustomerEditContainer = memo(({ organization, skip, ...props }) => (
  <ApolloProvider client={client}>
    <Mutation mutation={Mutations.UPDATE_ORGANIZATION}>
      {updateOrganization => (
        <Query {...{ query, skip }}>
          {({ data, loading, error }) => renderComponent({
            ...props,
            loading,
            error,
            organization,
            user: prop('user', data),
            initialValues: getInitialValues(organization),
            onSubmit: async (values, form) => {
              const currentValues = getInitialValues(organization);
              const difference = diff(values, currentValues);

              if (!difference) return undefined;

              const { customerType, signupPath } = values;

              return updateOrganization({
                variables: {
                  input: {
                    _id: organization._id,
                    customerType,
                    signupPath: signupPath ? encodeURIComponent(signupPath) : undefined,
                  },
                },
              }).then(noop).catch((err) => {
                form.reset(currentValues);
                throw err;
              });
            },
            onDelete: path(['user', 'isPlioAdmin'], data) ? () => {
              const onPasswordSubmit = async (password) => {
                if (!password) return swal.error(new Error(), 'Password can not be empty');

                const adminPassword = SHA256(password);

                try {
                  await deleteCustomerOrganization.callP({
                    organizationId: organization._id,
                    adminPassword,
                  });
                  return swal.success(
                    'Success',
                    `Organization ${organization.name} has been deleted`,
                  );
                } catch (err) {
                  return swal.error(err, `Could not delete organization ${organization.name}`);
                }
              };

              const showPasswordInput = () => swal.showPasswordForm({
                title: `Confirm deletion of "${organization.name}" organization`,
              }, onPasswordSubmit);

              return swal(ORG_DELETE, showPasswordInput);
            } : undefined,
          })}
        </Query>
      )}
    </Mutation>
  </ApolloProvider>
));

CustomerEditContainer.propTypes = {
  organization: PropTypes.object.isRequired,
  skip: PropTypes.bool,
};

export default CustomerEditContainer;
