import PropTypes from 'prop-types';
import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop } from 'plio-util';
import { compose, pick, over, pathOr, repeat } from 'ramda';
import { pure } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateCostLine } from '../../../validation';
import { EntityModalNext } from '../../components';
import { WithState, Composer } from '../../helpers';
import CostLineForm from './CostLineForm';

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
            {...{ isOpen, toggle, initialValues }}
            isEditMode
            loading={query.loading}
            error={query.error}
            label="Cost line"
            guidance="Cost line"
            validate={validateCostLine}
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
            {({ form: { form } }) => (
              <CostLineForm {...{ organizationId }} save={form.submit} />
            )}
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
