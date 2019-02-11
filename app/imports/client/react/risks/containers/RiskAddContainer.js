import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions, getEntityOptions } from 'plio-util';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { ProblemMagnitudes } from '../../../../share/constants';
import { validateRisk, createFormError } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';

const RiskAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  onLink,
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
        skip={!isOpen}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_RISK}
        children={noop}
        refetchQueries={() => [
          { query: Queries.RISK_LIST, variables: { organizationId } },
        ]}
      />,
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
        type: getEntityOptions(riskTypes[0]),
      },
      onSubmit: (values) => {
        const {
          active,
          title,
          description,
          originator: { value: originatorId },
          owner: { value: ownerId },
          magnitude,
          type: { value: typeId } = {},
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
    })}
  </Composer>
);

RiskAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default React.memo(RiskAddContainer);
