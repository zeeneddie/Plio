import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import { pick, compose, over, pluck, unless, isNil, pathOr, repeat, path } from 'ramda';
import { Query, Mutation } from 'react-apollo';
import {
  getUserOptions,
  lenses,
  noop,
  mapEntitiesToOptions,
} from 'plio-util';
import diff from 'deep-diff';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { ProblemTypes } from '../../../../share/constants';
import { Composer, WithState, renderComponent } from '../../helpers';
import { swal } from '../../../util';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';

const getNonconformity = pathOr({}, repeat('nonconformity', 2));
const getInitialValues = compose(
  over(lenses.owner, getUserOptions),
  over(lenses.originator, getUserOptions),
  over(lenses.departments, mapEntitiesToOptions),
  over(lenses.standards, unless(
    isNil,
    mapEntitiesToOptions,
  )),
  pick([
    'title',
    'description',
    'owner',
    'originator',
    'magnitude',
    'standards',
    'statusComment',
    'departments',
    'status',
    'sequentialId',
    'cost',
    'ref',
  ]),
);

const NonconformityEditContainer = ({
  nonconformity: _nonconformity = null,
  nonconformityId,
  organizationId,
  isOpen,
  toggle,
  type,
  onDelete,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  guidelines,
  currency,
  ...props
}) => (
  <WithState
    initialState={{
      nonconformity: _nonconformity,
      initialValues: unless(isNil, getInitialValues, _nonconformity),
    }}
  >
    {({ state: { initialValues, nonconformity }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.NONCONFORMITY_CARD}
            variables={{ _id: nonconformityId, organizationId }}
            skip={!!_nonconformity}
            onCompleted={data => setState({
              initialValues: getInitialValues(getNonconformity(data)),
              nonconformity: getNonconformity(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_NONCONFORMITY}
            onCompleted={({ updateNonconformity }) =>
              setState({ nonconformity: updateNonconformity })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.DELETE_NONCONFORMITY}
            children={noop}
            refetchQueries={() => [
              type === ProblemTypes.NON_CONFORMITY
                ? { query: Queries.NONCONFORMITY_LIST, variables: { organizationId } }
                : { query: Queries.POTENTIAL_GAIN_LIST, variables: { organizationId } },
              { query: Queries.CANVAS_PAGE, variables: { organizationId } },
            ]}
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { data, loading, error },
          updateNonconformity,
          deleteNonconformity,
        ]) => renderComponent({
          ...props,
          loading,
          error,
          organizationId,
          isOpen,
          toggle,
          nonconformity,
          initialValues,
          type,
          guidelines: guidelines || path(['organization', 'ncGuidelines'], data),
          currency: currency || path(['organization', 'currency'], data),
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(nonconformity);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              magnitude,
              standards,
              description,
              statusComment,
              departments,
              cost,
              ref: { url, text },
              owner: { value: ownerId } = {},
              originator: { value: originatorId } = {},
            } = values;

            return updateNonconformity({
              variables: {
                input: {
                  _id: nonconformity._id,
                  title,
                  description,
                  ownerId,
                  originatorId,
                  magnitude,
                  statusComment,
                  cost,
                  ref: { url, text },
                  standardsIds: pluck('value', standards || []),
                  departmentsIds: pluck('value', departments),
                },
              },
            }).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
          onDelete: () => {
            if (onDelete) return onDelete();
            const nonconformityName = type === ProblemTypes.NON_CONFORMITY ?
              'nonconformity' : 'potential gain';
            return swal.promise({
              text: `The ${nonconformityName} "${nonconformity.title}" will be deleted`,
              confirmButtonText: 'Delete',
              successTitle: 'Deleted!',
              successText: `The ${nonconformityName} "${nonconformity.title}" ` +
                'was deleted successfully.',
            }, () => deleteNonconformity({
              variables: {
                input: {
                  _id: nonconformity._id,
                },
              },
            }).then(toggle));
          },
        })}
      </Composer>
    )}
  </WithState>
);

NonconformityEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  nonconformity: PropTypes.object,
  type: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
  nonconformityId: PropTypes.string,
  fetchPolicy: PropTypes.string,
  guidelines: PropTypes.object,
  currency: PropTypes.string,
};

export default pure(NonconformityEditContainer);
