import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, noop } from 'plio-util';
import { Form } from 'reactstrap';

import { CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateCustomerRelationship } from '../../../validation';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import { getUserDefaultCanvasColor } from '../helpers';
import ModalGuidancePanel from '../../guidance/components/ModalGuidancePanel';
import CanvasAddModalHelp from './CanvasAddModalHelp';
import CustomerRelationshipsHelp from './CustomerRelationshipsHelp';

const CustomerRelationshipAddModal = ({
  isOpen,
  toggle,
  organizationId,
  onLink = noop,
}) => (
  <Query query={Queries.CANVAS_CURRENT_USER_INFO} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_CUSTOMER_RELATIONSHIP}>
        {createCustomerRelationship => (
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
                const errors = validateCustomerRelationship(values);

                if (errors) return errors;

                const {
                  title,
                  originator: { value: originatorId },
                  color,
                  notes,
                } = values;

                return createCustomerRelationship({
                  variables: {
                    input: {
                      organizationId,
                      title,
                      originatorId,
                      color,
                      notes,
                    },
                  },
                }).then(({ data: { createCustomerRelationship: { customerRelationship } } }) => {
                  onLink(customerRelationship._id);
                  toggle();
                });
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Customer relationship" />
                  <EntityModalBody>
                    <CanvasAddModalHelp>
                      <CustomerRelationshipsHelp />
                    </CanvasAddModalHelp>
                    <ModalGuidancePanel documentType={CanvasTypes.CUSTOMER_RELATIONSHIP} />
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

CustomerRelationshipAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func,
};

export default React.memo(CustomerRelationshipAddModal);
