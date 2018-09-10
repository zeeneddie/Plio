import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getEntityOptions, getUserOptions, lenses, noop, convertDocumentOptions } from 'plio-util';
import { compose, pick, over, pathOr, repeat, defaultTo } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateCustomerSegment } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import CustomerSegmentForm from './CustomerSegmentForm';
import CustomerInsightsSubcard from './CustomerInsightsSubcard';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';

const getCustomerSegment = pathOr({}, repeat('customerSegment', 2));
const getNeeds = pathOr([], repeat('needs', 2));
const getWants = pathOr([], repeat('wants', 2));
const getInitialValues = compose(
  over(lenses.matchedTo, compose(defaultTo(OptionNone), getEntityOptions)),
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'percentOfMarketSize',
    'matchedTo',
    'notes',
  ]),
  getCustomerSegment,
);

const CustomerSegmentEditModal = ({
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
            query={Queries.CUSTOMER_SEGMENT_CARD}
            variables={{ _id, organizationId }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_CUSTOMER_SEGMENT} children={noop} />,
          <Mutation mutation={Mutations.DELETE_CUSTOMER_SEGMENT} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateCustomerSegment, deleteCustomerSegment]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
            guidance="Customer segment"
            onDelete={() => {
              const { title } = getCustomerSegment(data);
              swal.promise(
                {
                  text: `The customer segment "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The customer segment "${title}" was deleted successfully.`,
                },
                () => deleteCustomerSegment({
                  variables: { input: { _id } },
                  refetchQueries: [
                    { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                  ],
                }).then(toggle),
              );
            }}
          >
            <EntityModalForm
              {...{ initialValues }}
              validate={validateCustomerSegment}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const isDirty = diff(values, currentValues);

                if (!isDirty) return undefined;

                const {
                  title,
                  originator = {},
                  color = {},
                  matchedTo,
                  percentOfMarketSize,
                  notes = '',
                } = values;

                return updateCustomerSegment({
                  variables: {
                    input: {
                      _id,
                      title,
                      notes,
                      color,
                      percentOfMarketSize,
                      originatorId: originator.value,
                      matchedTo: convertDocumentOptions({
                        documentType: CanvasTypes.VALUE_PROPOSITION,
                      }, matchedTo),
                    },
                  },
                }).then(noop).catch((err) => {
                  form.reset(currentValues);
                  throw err;
                });
              }}
            >
              {({ handleSubmit }) => (
                <Fragment>
                  <EntityModalHeader label="Customer segment" />
                  <EntityModalBody>
                    <CustomerSegmentForm {...{ organizationId }} save={handleSubmit} />
                    {_id && (
                      <CustomerInsightsSubcard
                        {...{ organizationId }}
                        documentId={_id}
                        documentType={CanvasTypes.CUSTOMER_SEGMENT}
                        needs={getNeeds(data)}
                        wants={getWants(data)}
                      />
                    )}
                  </EntityModalBody>
                </Fragment>
              )}
            </EntityModalForm>
          </EntityModalNext>
        )}
      </Composer>
    )}
  </WithState>
);

CustomerSegmentEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(CustomerSegmentEditModal);
