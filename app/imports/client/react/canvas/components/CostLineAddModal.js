import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions } from 'plio-util';
import { Form } from 'reactstrap';
import { pure } from 'recompose';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import CostLineForm from './CostLineForm';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateCostLine } from '../../../validation';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import { getUserDefaultCanvasColor } from '../helpers';

const CostLineAddModal = ({
  isOpen,
  toggle,
  organizationId,
}) => (
  <Query query={Queries.CANVAS_CURRENT_USER_INFO} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_COST_LINE}>
        {createCostLine => (
          <EntityModalNext {...{ isOpen, toggle }}>
            <EntityModalForm
              keepDirtyOnReinitialize
              initialValues={{
                originator: getUserOptions(user),
                title: '',
                color: getUserDefaultCanvasColor(user),
                notes: '',
                percentOfTotalCost: null,
              }}
              onSubmit={(values) => {
                const errors = validateCostLine(values);

                if (errors) return errors;

                const {
                  title,
                  originator: { value: originatorId },
                  color,
                  percentOfTotalCost,
                  notes,
                } = values;

                return createCostLine({
                  awaitRefetchQueries: true,
                  variables: {
                    input: {
                      organizationId,
                      title,
                      originatorId,
                      percentOfTotalCost,
                      color,
                      notes,
                    },
                  },
                  refetchQueries: [
                    { query: Queries.COST_LINES, variables: { organizationId } },
                  ],
                }).then(toggle);
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Cost line" />
                  <EntityModalBody>
                    <Form onSubmit={handleSubmit}>
                      {/* hidden input is needed for return key to work */}
                      <input hidden type="submit" />
                      <CostLineForm {...{ organizationId }} />
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

CostLineAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(CostLineAddModal);
