import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions, lenses } from 'plio-util';
import { view } from 'ramda';
import { pure } from 'recompose';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { ProblemMagnitudes } from '../../../../share/constants';
import { validateRisk, createFormError } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';
import { swal } from '../../../util';

const RiskAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  onLink,
  onUnlink,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.CURRENT_USER_FULL_NAME}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Query
        query={Queries.RISK_TYPE_LIST}
        variables={{ organizationId }}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Mutation mutation={Mutations.CREATE_RISK} children={noop} />,
      <Mutation mutation={Mutations.DELETE_RISK} children={noop} />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([
      { data: { user } },
      {
        data: {
          riskTypes: { riskTypes = [] } = {},
        },
      },
      createRisk,
      deleteRisk,
    ]) => renderComponent({
      ...props,
      isOpen,
      toggle,
      organizationId,
      initialValues: {
        active: 0,
        title: '',
        magnitude: ProblemMagnitudes.MAJOR,
        originator: getUserOptions(user),
        owner: getUserOptions(user),
        type: view(lenses.head._id, riskTypes),
      },
      onSubmit: (values) => {
        const {
          active,
          title,
          description,
          originator: { value: originatorId },
          owner: { value: ownerId },
          magnitude,
          type: typeId,
          risk: existingRisk = {},
        } = values;

        if (active === 1) {
          if (!existingRisk.value) return createFormError('Risk required');
          return onLink(existingRisk.value).then(toggle || noop);
        }

        const errors = validateRisk(values);
        if (errors) return errors;

        return createRisk({
          variables: {
            input: {
              title,
              description,
              originatorId,
              ownerId,
              magnitude,
              typeId,
              organizationId,
            },
          },
        }).then(({ data: { createRisk: { risk } } }) => onLink(risk._id))
          .then(toggle || noop);
      },
      // TODO move it into RiskEditContainer when risk will be refactored
      onDelete: (event, { entity: { _id, title } }) => swal.withExtraAction({
        title: 'Choose an action',
        text: `Do you wish to unlink the risk "${title}" ` +
          'from the current document, or delete it completely?',
        confirmButtonText: 'Delete',
        successText: `The risk "${title}" was deleted successfully.`,
        extraButton: 'Unlink',
        extraHandler: () => onUnlink(_id),
        confirmHandler: () => deleteRisk({
          variables: {
            input: { _id },
          },
          refetchQueries: [{
            query: Queries.RISK_LIST,
            variables: { organizationId },
          }],
        }).then(() => onUnlink(_id)),
      }),
    })}
  </Composer>
);

RiskAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default pure(RiskAddContainer);
