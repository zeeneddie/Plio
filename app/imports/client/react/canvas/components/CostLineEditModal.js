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
import { validateCostLine } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import CostLineForm from './CostLineForm';
import ModalGuidancePanel from '../../guidance/components/ModalGuidancePanel';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
} from '../../components';
import CanvasSubcards from './CanvasSubcards';
import CostStructureHelp from './CostStructureHelp';

const getCostLine = pathOr({}, repeat('costLine', 2));
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  over(lenses.lessons, getIds),
  over(lenses.files, getIds),
  pick([
    'originator',
    'title',
    'color',
    'percentOfTotalCost',
    'notes',
    'notify',
    'lessons',
    'files',
  ]),
  getCostLine,
);

const enhance = compose(
  withHandlers({
    refetchQueries: ({ _id, organizationId }) => () => [
      { query: Queries.COST_LINE_CARD, variables: { _id, organizationId } },
    ],
  }),
  pure,
);

const CostLineEditModal = ({
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
            query={Queries.COST_LINE_CARD}
            variables={{ _id, organizationId }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_COST_LINE} children={noop} />,
          <Mutation mutation={Mutations.DELETE_COST_LINE} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateCostLine, deleteCostLine]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
            onDelete={() => {
              const { title } = getCostLine(data);
              swal.promise(
                {
                  text: `The cost line "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The cost line "${title}" was deleted successfully.`,
                },
                () => deleteCostLine({
                  variables: { input: { _id } },
                }).then(toggle),
              );
            }}
          >
            <EntityModalForm
              {...{ initialValues }}
              validate={validateCostLine}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const isDirty = diff(values, currentValues);

                if (!isDirty) return undefined;

                const {
                  title,
                  originator,
                  color,
                  percentOfTotalCost,
                  notes = '', // final form sends undefined value instead of an empty string
                  notify = [],
                  files = [],
                } = values;

                return updateCostLine({
                  variables: {
                    input: {
                      _id,
                      title,
                      notes,
                      color,
                      percentOfTotalCost,
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
                  <EntityModalHeader label="Cost line" />
                  <EntityModalBody>
                    <ModalGuidancePanel documentType={CanvasTypes.COST_LINE}>
                      <CostStructureHelp />
                    </ModalGuidancePanel>
                    <RenderSwitch
                      require={isOpen && !query.loading && data.costLine && data.costLine.costLine}
                      errorWhenMissing={noop}
                      loading={query.loading}
                      renderLoading={(
                        <fieldset disabled>
                          <CostLineForm {...{ organizationId }} />
                        </fieldset>
                      )}
                    >
                      {costLine => (
                        <Fragment>
                          <CostLineForm {...{ organizationId }} save={handleSubmit} />
                          <CanvasSubcards
                            {...{ organizationId, refetchQueries }}
                            section={costLine}
                            onChange={handleSubmit}
                            refetchQuery={Queries.COST_LINE_CARD}
                            documentType={CanvasTypes.COST_LINE}
                            slingshotDirective={AWSDirectives.COST_LINE_FILES}
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

CostLineEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
  refetchQueries: PropTypes.func,
};

export default enhance(CostLineEditModal);
