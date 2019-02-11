import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, noop } from 'plio-util';
import { Form } from 'reactstrap';

import { CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import RevenueStreamForm from './RevenueStreamForm';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateRevenueStream } from '../../../validation';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import { getUserDefaultCanvasColor } from '../helpers';
import ModalGuidancePanel from '../../guidance/components/ModalGuidancePanel';
import CanvasAddModalHelp from './CanvasAddModalHelp';
import RevenueStreamsHelp from './RevenueStreamsHelp';

const RevenueStreamAddModal = ({
  isOpen,
  toggle,
  organizationId,
  onLink = noop,
}) => (
  <Query query={Queries.CANVAS_CURRENT_USER_INFO} fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}>
    {({ data: { user } }) => (
      <Mutation mutation={Mutations.CREATE_REVENUE_STREAM}>
        {createRevenueStream => (
          <EntityModalNext {...{ isOpen, toggle }}>
            <EntityModalForm
              keepDirtyOnReinitialize
              initialValues={{
                originator: getUserOptions(user),
                title: '',
                color: getUserDefaultCanvasColor(user),
                notes: '',
                percentOfRevenue: null,
                percentOfProfit: null,
              }}
              onSubmit={(values) => {
                const errors = validateRevenueStream(values);

                if (errors) return errors;

                const {
                  title,
                  originator: { value: originatorId },
                  color,
                  percentOfRevenue,
                  percentOfProfit,
                  notes,
                } = values;

                return createRevenueStream({
                  variables: {
                    input: {
                      organizationId,
                      title,
                      originatorId,
                      color,
                      notes,
                      percentOfRevenue,
                      percentOfProfit,
                    },
                  },
                }).then(({ data: { createRevenueStream: { revenueStream } } }) => {
                  onLink(revenueStream._id);
                  toggle();
                });
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Revenue stream" />
                  <EntityModalBody>
                    <CanvasAddModalHelp>
                      <RevenueStreamsHelp />
                    </CanvasAddModalHelp>
                    <ModalGuidancePanel documentType={CanvasTypes.REVENUE_STREAM} />
                    <Form onSubmit={handleSubmit}>
                      {/* hidden input is needed for return key to work */}
                      <input hidden type="submit" />
                      <RevenueStreamForm {...{ organizationId }} />
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

RevenueStreamAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func,
};

export default React.memo(RevenueStreamAddModal);
