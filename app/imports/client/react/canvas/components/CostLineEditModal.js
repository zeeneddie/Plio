import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { AWSDirectives, CanvasSections } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateCostLine } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import CostLineForm from './CostLineForm';
import CanvasFilesSubcard from './CanvasFilesSubcard';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';

const getCostLine = pathOr({}, repeat('costLine', 2));
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  pick([
    'originator',
    'title',
    'color',
    'percentOfTotalCost',
    'notes',
  ]),
  getCostLine,
);

const CostLineEditModal = ({
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
            query={Queries.COST_LINE_CARD}
            variables={{ _id }}
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
            guidance="Cost line"
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
                  refetchQueries: [
                    { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                  ],
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
                } = values;

                return updateCostLine({
                  variables: {
                    input: {
                      _id,
                      title,
                      notes,
                      color,
                      percentOfTotalCost,
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
                    <CostLineForm {...{ organizationId }} save={handleSubmit} />
                    {_id && (
                      <CanvasFilesSubcard
                        {...{ organizationId }}
                        documentId={_id}
                        onUpdate={updateCostLine}
                        slingshotDirective={AWSDirectives.COST_LINE_FILES}
                        documentType={CanvasSections.COST_STRUCTURE}
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

CostLineEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
};

export default pure(CostLineEditModal);
