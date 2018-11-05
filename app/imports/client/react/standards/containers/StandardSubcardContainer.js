import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import StandardEditContainer from './StandardEditContainer';

const StandardSubcardContainer = ({
  organizationId,
  standard,
  onUnlink,
  toggle,
  ...props
}) => (
  <Mutation mutation={Mutations.DELETE_STANDARD}>
    {deleteStandard => (
      <StandardEditContainer
        {...{
          ...props,
          organizationId,
          standard,
          toggle,
        }}
        onDelete={() => swal.withExtraAction({
          title: 'Choose an action',
          text: `Do you wish to unlink the standard "${standard.title}" from the ` +
            'current document, or delete it completely?',
          confirmButtonText: 'Delete',
          successText: `The standard "${standard.title}" was deleted successfully.`,
          extraButton: 'Unlink',
          extraHandler: () => onUnlink(standard._id).then(toggle),
          confirmHandler: () => deleteStandard({
            variables: {
              input: {
                _id: standard._id,
              },
            },
            refetchQueries: [{
              query: Queries.STANDARD_LIST,
              variables: { organizationId },
            }],
          }).then(() => onUnlink(standard._id)).then(toggle),
        })}
      />
    )}
  </Mutation>
);

StandardSubcardContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standard: PropTypes.object.isRequired,
  toggle: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
};

export default StandardSubcardContainer;
