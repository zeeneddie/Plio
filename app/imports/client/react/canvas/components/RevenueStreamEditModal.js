import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import {
  getUserOptions,
  lenses,
  noop,
  mapUsersToOptions,
  getValues,
  getIds,
} from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure, withHandlers } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateRevenueStream } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import RevenueStreamForm from './RevenueStreamForm';
import ModalGuidancePanel from '../../guidance/components/ModalGuidancePanel';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
} from '../../components';
import CanvasSubcards from './CanvasSubcards';

const getRevenueStream = pathOr({}, repeat('revenueStream', 2));
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  over(lenses.lessons, getIds),
  over(lenses.files, getIds),
  pick([
    'originator',
    'title',
    'color',
    'percentOfRevenue',
    'percentOfProfit',
    'notes',
    'notify',
    'lessons',
    'files',
  ]),
  getRevenueStream,
);

const enhance = compose(
  withHandlers({
    refetchQueries: ({ _id, organizationId }) => () => [
      { query: Queries.REVENUE_STREAM_CARD, variables: { _id, organizationId } },
    ],
  }),
  pure,
);

const RevenueStreamEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
  refetchQueries,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            query={Queries.REVENUE_STREAM_CARD}
            variables={{ _id, organizationId }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_REVENUE_STREAM} children={noop} />,
          <Mutation mutation={Mutations.DELETE_REVENUE_STREAM} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateRevenueStream, deleteRevenueStream]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
            onDelete={() => {
              const { title } = getRevenueStream(data);
              swal.promise(
                {
                  text: `The revenue stream "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The revenue stream "${title}" was deleted successfully.`,
                },
                () => deleteRevenueStream({
                  variables: { input: { _id } },
                }).then(toggle),
              );
            }}
          >
            <EntityModalForm
              {...{ initialValues }}
              validate={validateRevenueStream}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const isDirty = diff(values, currentValues);

                if (!isDirty) return undefined;

                const {
                  title,
                  originator,
                  color,
                  percentOfRevenue,
                  percentOfProfit,
                  notes = '', // final form sends undefined value instead of an empty string
                  notify = [],
                  files = [],
                } = values;

                return updateRevenueStream({
                  variables: {
                    input: {
                      _id,
                      title,
                      notes,
                      color,
                      percentOfRevenue,
                      percentOfProfit,
                      fileIds: files,
                      notify: getValues(notify),
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
                  <EntityModalHeader label="Revenue stream" />
                  <EntityModalBody>
                    <ModalGuidancePanel documentType={CanvasTypes.REVENUE_STREAM} />
                    <RenderSwitch
                      require={isOpen && data.revenueStream && data.revenueStream.revenueStream}
                      errorWhenMissing={noop}
                      loading={query.loading}
                      renderLoading={<RevenueStreamForm {...{ organizationId }} />}
                    >
                      {revenueStream => (
                        <Fragment>
                          <RevenueStreamForm {...{ organizationId }} save={handleSubmit} />
                          <CanvasSubcards
                            {...{ organizationId, refetchQueries }}
                            section={revenueStream}
                            onChange={handleSubmit}
                            documentType={CanvasTypes.REVENUE_STREAM}
                            slingshotDirective={AWSDirectives.REVENUE_STREAM_FILES}
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

RevenueStreamEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
  refetchQueries: PropTypes.func,
};

export default enhance(RevenueStreamEditModal);
