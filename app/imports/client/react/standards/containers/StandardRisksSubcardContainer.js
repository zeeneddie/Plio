import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { sort } from 'ramda';
import { bySerialNumber, getIds, noop } from 'plio-util';
import { Query, Mutation } from 'react-apollo';
import { Form } from 'react-final-form';
import diff from 'deep-diff';

import { namedCompose, withStore, withApollo, Composer } from '../../helpers';
import { getOrganizationId, getRiskGuidelines } from '../../../store/selectors';
import { getRisksLinkedToStandard } from '../../../store/selectors/risks';
import { Mutation as Mutations, Query as Queries } from '../../../graphql';
import RisksSubcard from '../../risks/components/RisksSubcard';
import EntitiesField from '../../forms/components/EntitiesField';
import { swal } from '../../../util';

const StandardRisksSubcardContainer = ({
  organizationId,
  guidelines,
  risks,
  linkedTo,
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation mutation={Mutations.LINK_STANDARD_TO_RISK} children={noop} />,
      <Mutation mutation={Mutations.UNLINK_STANDARD_FROM_RISK} children={noop} />,
      <Query
        query={Queries.CURRENT_USER_FULL_NAME}
        children={noop}
      />,
      <Query
        query={Queries.RISK_TYPE_LIST}
        variables={{ organizationId }}
        children={noop}
      />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([linkStandardToRisk, unlinkStandardFromRisk]) => (
      <Form
        subscription={{}}
        initialValues={{ risks: getIds(risks) }}
        onSubmit={({ risks: riskIds }) => {
          // TEMP: solution until we refactor standard edit modal
          const difference = diff(getIds(risks), riskIds);

          if (!difference) return undefined;

          if (difference[0].item.kind === 'N') {
            return linkStandardToRisk({
              variables: {
                input: {
                  _id: difference[0].item.rhs,
                  standardId: linkedTo._id,
                },
              },
            }).catch(swal.error);
          }

          if (difference[0].item.kind === 'D') {
            return unlinkStandardFromRisk({
              variables: {
                input: {
                  _id: difference[0].item.lhs,
                  standardId: linkedTo._id,
                },
              },
            }).catch(swal.error);
          }

          return undefined;
        }}
      >
        {({ handleSubmit }) => (
          <EntitiesField
            {...{ organizationId, guidelines, linkedTo }}
            name="risks"
            render={RisksSubcard}
            onChange={handleSubmit}
            risks={sort(bySerialNumber, risks)}
          />
        )}
      </Form>
    )}
  </Composer>
);

StandardRisksSubcardContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  guidelines: PropTypes.object.isRequired,
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkedTo: PropTypes.object.isRequired,
};

export default namedCompose('StandardRisksSubcardContainer')(
  withStore,
  withApollo,
  connect((state, { standardId }) => ({
    organizationId: getOrganizationId(state),
    risks: getRisksLinkedToStandard(state, { standardId }),
    linkedTo: state.collections.standardsByIds[standardId],
    guidelines: getRiskGuidelines(state),
  })),
)(StandardRisksSubcardContainer);
