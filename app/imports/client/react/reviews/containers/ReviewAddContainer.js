import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions } from 'plio-util';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Composer, renderComponent } from '../../helpers';

const ReviewAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  documentId,
  documentType,
  refetchQueries,
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
      <Mutation
        {...{ refetchQueries }}
        mutation={Mutations.CREATE_REVIEW}
        children={noop}
      />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([{ data: { user } }, createReview]) => renderComponent({
      ...props,
      isOpen,
      toggle,
      organizationId,
      initialValues: {
        // TODO get right scheduledDate
        scheduledDate: Date.now(),
        reviewedAt: Date.now(),
        reviewedBy: getUserOptions(user),
        comments: '',
      },
      onSubmit: (values) => {
        const {
          scheduledDate,
          reviewedAt,
          comments = '',
          reviewedBy: { value: reviewedBy },
        } = values;

        return createReview({
          variables: {
            input: {
              scheduledDate,
              reviewedAt,
              comments,
              reviewedBy,
              organizationId,
              documentId,
              documentType,
            },
          },
        }).then(({ data: { createReview: { review } } }) => onLink(review._id))
          .then(toggle || noop);
      },
    })}
  </Composer>
);

ReviewAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default ReviewAddContainer;
