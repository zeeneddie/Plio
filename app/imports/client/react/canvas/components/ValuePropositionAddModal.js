import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, convertDocumentOptions, noop } from 'plio-util';
import { Form } from 'reactstrap';
import { pure } from 'recompose';

import { CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import ValuePropositionForm from './ValuePropositionForm';
import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { validateValueProposition } from '../../../validation';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import { getUserDefaultCanvasColor } from '../helpers';

const ValuePropositionAddModal = ({
  isOpen,
  toggle,
  organizationId,
  onLink = noop,
}) => (
  <Query query={Queries.CANVAS_CURRENT_USER_INFO} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_VALUE_PROPOSITION}>
        {createValueProposition => (
          <EntityModalNext {...{ isOpen, toggle }}>
            <EntityModalForm
              keepDirtyOnReinitialize
              initialValues={{
                originator: getUserOptions(user),
                title: '',
                color: getUserDefaultCanvasColor(user),
                matchedTo: OptionNone,
                notes: '',
              }}
              onSubmit={(values) => {
                const errors = validateValueProposition(values);

                if (errors) return errors;

                const {
                  title,
                  originator: { value: originatorId },
                  color,
                  matchedTo,
                  notes,
                } = values;

                return createValueProposition({
                  variables: {
                    input: {
                      organizationId,
                      title,
                      originatorId,
                      color,
                      notes,
                      matchedTo: convertDocumentOptions({
                        documentType: CanvasTypes.CUSTOMER_SEGMENT,
                      }, matchedTo),
                    },
                  },
                }).then(({ data: { createValueProposition: { valueProposition } } }) => {
                  onLink(valueProposition._id);
                  toggle();
                });
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Value proposition" />
                  <EntityModalBody>
                    <Form onSubmit={handleSubmit}>
                      {/* hidden input is needed for return key to work */}
                      <input hidden type="submit" />
                      <ValuePropositionForm {...{ organizationId }} />
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

ValuePropositionAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func,
};

export default pure(ValuePropositionAddModal);
