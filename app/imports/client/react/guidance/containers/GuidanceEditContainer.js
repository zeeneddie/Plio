import PropTypes from 'prop-types';
import React from 'react';
import { pure } from 'recompose';
import {
  pick,
  unless,
  isNil,
  pathOr,
  repeat,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import { noop } from 'plio-util';
import diff from 'deep-diff';

import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { swal } from '../../../util';

const getGuidance = pathOr({}, repeat('guidance', 2));
const getInitialValues = pick(['title', 'html']);

const GuidanceEditContainer = ({
  guidance: _guidance = null,
  guidanceId,
  isOpen,
  toggle,
  onDelete,
  refetchQueries,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  documentType,
  ...props
}) => (
  <WithState
    initialState={{
      guidance: _guidance,
      initialValues: unless(isNil, getInitialValues, _guidance),
    }}
  >
    {({ state: { initialValues, guidance }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.GUIDANCE} // Just a placeholder. Swap when this is needed
            variables={{ _id: guidanceId }}
            skip={!!_guidance}
            onCompleted={data => setState({
              initialValues: getInitialValues(getGuidance(data)),
              guidance: getGuidance(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_GUIDANCE}
            children={noop}
            onCompleted={({ updateGuidance }) => setState({ guidance: updateGuidance })}
          />,
          <Mutation
            {...{ refetchQueries }}
            mutation={Mutations.REMOVE_GUIDANCE}
            children={noop}
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { loading, error },
          updateGuidance,
          removeGuidance,
        ]) => renderComponent({
          ...props,
          error,
          isOpen,
          toggle,
          initialValues,
          guidance,
          loading,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(guidance);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              html,
            } = values;

            return updateGuidance({
              variables: {
                input: {
                  _id: guidance._id,
                  title,
                  html,
                },
              },
            }).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
          onDelete: () => {
            if (onDelete) return onDelete();

            return swal.promise({
              text: `The guidance "${guidance.title}" will be permanently deleted`,
              confirmButtonText: 'Delete',
              successTitle: 'Deleted!',
              successText: `The guidance "${guidance.title}" was deleted successfully.`,
            }, () => removeGuidance({
              variables: {
                input: { _id: guidance._id },
              },
            })).then(toggle || noop);
          },
        })}
      </Composer>
    )}
  </WithState>
);

GuidanceEditContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refetchQueries: PropTypes.func,
  onDelete: PropTypes.func,
  guidanceId: PropTypes.string,
  guidance: PropTypes.object,
  fetchPolicy: PropTypes.string,
  documentType: PropTypes.string.isRequired,
};

export default pure(GuidanceEditContainer);
