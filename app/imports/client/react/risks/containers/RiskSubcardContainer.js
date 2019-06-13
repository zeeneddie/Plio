import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import RiskEditContainer from './RiskEditContainer';

const RiskSubcardContainer = ({
  organizationId,
  risk,
  onUnlink,
  toggle,
  ...props
}) => (
  <Mutation
    mutation={Mutations.DELETE_RISK}
    refetchQueries={() => [
      { query: Queries.RISK_LIST, variables: { organizationId } },
    ]}
  >
    {deleteRisk => (
      <RiskEditContainer
        {...{
          ...props,
          organizationId,
          risk,
          toggle,
        }}
        onDelete={() => swal.withExtraAction({
          title: 'Choose an action',
          text: `Do you wish to unlink the risk "${risk.title}" from the ` +
            'current document, or delete it completely?',
          confirmButtonText: 'Delete',
          successText: `The risk "${risk.title}" was deleted successfully.`,
          extraButton: 'Unlink',
          extraHandler: () => onUnlink(risk._id).then(toggle),
          confirmHandler: () => deleteRisk({
            variables: {
              input: { _id: risk._id },
            },
          }).then(() => onUnlink(risk._id)).then(toggle),
        })}
      />
    )}
  </Mutation>
);

RiskSubcardContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  risk: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
};

export default RiskSubcardContainer;
