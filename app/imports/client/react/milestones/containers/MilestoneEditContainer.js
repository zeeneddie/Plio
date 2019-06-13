import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import {
  pick,
  compose,
  over,
  unless,
  isNil,
  pathOr,
  repeat,
  defaultTo,
  path,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import {
  lenses,
  noop,
  getValues,
  mapUsersToOptions,
  getEntityOptions,
  setOver,
} from 'plio-util';
import moment from 'moment';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const getMilestone = pathOr({}, repeat('milestone', 2));
const getInitialValues = compose(
  over(lenses.completionTargetDate, moment),
  over(lenses.completedAt, unless(isNil, moment)),
  over(lenses.notify, compose(mapUsersToOptions, defaultTo([]))),
  over(lenses.linkedTo, getEntityOptions),
  setOver(lenses.color, path(['linkedTo', 'color'])),
  pick([
    'title',
    'description',
    'completionTargetDate',
    'completedAt',
    'isCompleted',
    'completionComments',
    'notify',
    'linkedTo',
    'status',
  ]),
);

const MilestoneEditContainer = ({
  milestoneId,
  milestone: _milestone = null,
  isOpen,
  toggle,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  organizationId,
  onUnlink,
  ...props
}) => (
  <WithState
    initialState={{
      milestone: _milestone,
      initialValues: unless(isNil, getInitialValues, _milestone),
    }}
  >
    {({ state: { initialValues, milestone }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.MILESTONE_CARD}
            variables={{ _id: milestoneId }}
            skip={!isOpen || !!_milestone}
            onCompleted={data => setState({
              initialValues: getInitialValues(getMilestone(data)),
              milestone: getMilestone(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_MILESTONE}
            children={noop}
            onCompleted={({ updateMilestone }) => setState({ milestone: updateMilestone })}
          />,
          <Mutation
            mutation={Mutations.DELETE_MILESTONE}
            children={noop}
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { loading, error },
          updateMilestone,
          deleteMilestone,
        ]) => renderComponent({
          ...props,
          loading,
          error,
          isOpen,
          toggle,
          initialValues,
          milestone,
          organizationId,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(milestone);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              description = '',
              completionTargetDate,
              completedAt,
              completionComments = '',
              notify,
            } = values;

            const args = {
              variables: {
                input: {
                  _id: milestone._id,
                  title,
                  description,
                  completionTargetDate,
                  completedAt,
                  completionComments,
                },
              },
            };

            if (notify) {
              Object.assign(args.variables.input, { notify: getValues(notify) });
            }

            return updateMilestone(args).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
          onDelete: () => swal.promise({
            text: `The milestone "${milestone.title}" will be deleted`,
            confirmButtonText: 'Delete',
            successTitle: 'Deleted!',
            successText: `The milestone "${milestone.title}" was deleted successfully.`,
          }, () => deleteMilestone({
            variables: {
              input: { _id: milestone._id },
            },
          }).then(() => onUnlink(milestone._id))).then(toggle),
        })}
      </Composer>
    )}
  </WithState>
);

MilestoneEditContainer.defaultProps = {
  onUnlink: noop,
};

MilestoneEditContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  milestoneId: PropTypes.string,
  milestone: PropTypes.object,
  fetchPolicy: PropTypes.string,
  organizationId: PropTypes.string.isRequired,
  onUnlink: PropTypes.func,
};

export default pure(MilestoneEditContainer);
