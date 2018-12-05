import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import {
  getEntityOptions,
  getUserOptions,
  lenses,
  noop,
  convertDocumentOptions,
  getValues,
  mapUsersToOptions,
  getIds,
} from 'plio-util';
import { compose, pick, over, pathOr, repeat, defaultTo } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateCustomerSegment } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import CustomerSegmentForm from './CustomerSegmentForm';
import CustomerInsightsSubcard from './CustomerInsightsSubcard';
import CanvasModalGuidance from './CanvasModalGuidance';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
} from '../../components';
import CanvasSubcards from './CanvasSubcards';
import activelyManage from '../../forms/decorators/activelyManage';

const getCustomerSegment = pathOr({}, repeat('customerSegment', 2));
const getInitialValues = compose(
  over(lenses.matchedTo, compose(defaultTo(OptionNone), getEntityOptions)),
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  over(lenses.risks, getIds),
  over(lenses.goals, getIds),
  over(lenses.standards, getIds),
  over(lenses.nonconformities, getIds),
  over(lenses.potentialGains, getIds),
  over(lenses.lessons, getIds),
  over(lenses.files, defaultTo([])),
  pick([
    'originator',
    'title',
    'color',
    'percentOfMarketSize',
    'matchedTo',
    'notes',
    'notify',
    'risks',
    'goals',
    'standards',
    'nonconformities',
    'potentialGains',
    'lessons',
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
          <Mutation
            mutation={Mutations.MATCH_CUSTOMER_SEGMENT}
            refetchQueries={() => [{
              query: Queries.VALUE_PROPOSITIONS,
              variables: { organizationId },
            }]}
            children={noop}
          />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([
          { data, ...query },
          updateCustomerSegment,
          deleteCustomerSegment,
          matchCustomerSegment,
        ]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
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
              decorators={[activelyManage]}
              validate={validateCustomerSegment}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const difference = diff(values, currentValues);

                if (!difference) return undefined;

                const {
                  title,
                  originator = {},
                  color = {},
                  matchedTo,
                  percentOfMarketSize,
                  notes = '',
                  notify = [],
                  risks: riskIds,
                  goals: goalIds,
                  standards: standardsIds,
                  nonconformities: nonconformityIds,
                  potentialGains: potentialGainIds,
                  files = [],
                } = values;

                if (difference[0].path[0] === 'matchedTo') {
                  return matchCustomerSegment({
                    variables: {
                      input: {
                        _id,
                        matchedTo: convertDocumentOptions({
                          documentType: CanvasTypes.VALUE_PROPOSITION,
                        }, matchedTo),
                      },
                    },
                  }).then(noop).catch((err) => {
                    form.reset(currentValues);
                    throw err;
                  });
                }

                return updateCustomerSegment({
                  variables: {
                    input: {
                      _id,
                      title,
                      notes,
                      color,
                      percentOfMarketSize,
                      riskIds,
                      goalIds,
                      standardsIds,
                      nonconformityIds,
                      potentialGainIds,
                      notify: getValues(notify),
                      fileIds: files,
                      originatorId: originator.value,
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
                    <CanvasModalGuidance documentType={CanvasTypes.CUSTOMER_SEGMENT} />
                    <RenderSwitch
                      require={isOpen &&
                        data.customerSegment &&
                        data.customerSegment.customerSegment}
                      errorWhenMissing={noop}
                      loading={query.loading}
                      renderLoading={<CustomerSegmentForm {...{ organizationId }} />}
                    >
                      {customerSegment => (
                        <Fragment>
                          <CustomerSegmentForm
                            {...{ organizationId }}
                            matchedTo={customerSegment.matchedTo}
                            save={handleSubmit}
                          />
                          <CustomerInsightsSubcard
                            {...{ organizationId }}
                            needs={customerSegment.needs || []}
                            wants={customerSegment.wants || []}
                            documentId={customerSegment._id}
                            matchedTo={customerSegment.matchedTo}
                            documentType={CanvasTypes.CUSTOMER_SEGMENT}
                          />
                          <CanvasSubcards
                            {...{ organizationId }}
                            section={customerSegment}
                            onChange={handleSubmit}
                            refetchQuery={Queries.CUSTOMER_SEGMENT_CARD}
                            documentType={CanvasTypes.CUSTOMER_SEGMENT}
                            slingshotDirective={AWSDirectives.CUSTOMER_SEGMENT_FILES}
                            user={data && data.user}
                          />
                        </Fragment>
                      )}
                    </RenderSwitch>
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
