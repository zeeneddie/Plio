import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { ProblemTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import NonconformityEditContainer from './NonconformityEditContainer';

const NonconformitySubcardContainer = ({
  organizationId,
  nonconformity,
  onUnlink,
  toggle,
  type,
  ...props
}) => (
  <Mutation mutation={Mutations.DELETE_NONCONFORMITY}>
    {deleteNonconformity => (
      <NonconformityEditContainer
        {...{
          ...props,
          organizationId,
          nonconformity,
          toggle,
          type,
        }}
        onDelete={() => {
          const nonconformityName = type === ProblemTypes.NON_CONFORMITY ?
            'nonconformity' : 'potential gain';
          return swal.withExtraAction({
            title: 'Choose an action',
            text: `Do you wish to unlink the ${nonconformityName} "${nonconformity.title}" ` +
              'from the current document, or delete it completely?',
            confirmButtonText: 'Delete',
            successText: `The ${nonconformityName} "${nonconformity.title}"` +
            'was deleted successfully.',
            extraButton: 'Unlink',
            extraHandler: () => onUnlink(nonconformity._id).then(toggle),
            confirmHandler: () => deleteNonconformity({
              variables: {
                input: {
                  _id: nonconformity._id,
                },
              },
              refetchQueries: [{
                query: Queries.NONCONFORMITY_LIST,
                variables: { organizationId, type },
              }],
            }).then(() => onUnlink(nonconformity._id)).then(toggle),
          });
        }}
      />
    )}
  </Mutation>
);

NonconformitySubcardContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  nonconformity: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  onUnlink: PropTypes.func.isRequired,
};

export default NonconformitySubcardContainer;
