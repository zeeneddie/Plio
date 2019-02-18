import PropTypes from 'prop-types';
import React, { useCallback, memo } from 'react';
import { Mutation, Query, ApolloProvider } from 'react-apollo';
import { noop } from 'plio-util';

import { client } from '../../../apollo';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import MarkAsReadModal from '../components/MarkAsReadModal';

const MarkAsReadModalWrapper = ({
  user,
  updateStandard,
  standard,
  toggle,
  ...props
}) => {
  const markAsRead = useCallback(
    () => updateStandard({
      variables: {
        input: {
          _id: standard._id,
          readBy: standard.readBy.concat(user._id),
        },
      },
    }).then(() => (toggle || noop)()).catch(swal.error),
    [standard, user, updateStandard],
  );

  return (
    <MarkAsReadModal
      {...{ toggle, ...props }}
      onSubmit={markAsRead}
      initialValues={{}}
    />
  );
};

MarkAsReadModalWrapper.propTypes = {
  user: PropTypes.object,
  updateStandard: PropTypes.func.isRequired,
  standard: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    readBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  toggle: PropTypes.func,
};

const StandardMarkAsReadModalContainer = memo(({ standard, ...props }) => (
  <ApolloProvider {...{ client }}>
    <Query query={Queries.CURRENT_USER_FULL_NAME}>
      {({ data: { user } }) => (
        <Mutation mutation={Mutations.UPDATE_STANDARD}>
          {updateStandard => (
            <MarkAsReadModalWrapper
              {...{
                ...props,
                user,
                updateStandard,
                standard,
              }}
            />
          )}
        </Mutation>
      )}
    </Query>
  </ApolloProvider>
));

StandardMarkAsReadModalContainer.propTypes = {
  standard: PropTypes.object.isRequired,
};

export default StandardMarkAsReadModalContainer;
