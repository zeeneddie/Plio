import PropTypes from 'prop-types';
import React, { useState } from 'react';
import {
  pick,
  compose,
  over,
  unless,
  isNil,
  pathOr,
  repeat,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import { getUserOptions, lenses, noop } from 'plio-util';
import diff from 'deep-diff';

import { Composer, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { swal } from '../../../util';

const getReview = pathOr({}, repeat('review', 2));
const getInitialValues = compose(
  pick(['scheduledDate', 'reviewedAt', 'comments', 'reviewedBy']),
  over(lenses.reviewedBy, getUserOptions),
);

const ReviewEditContainer = ({
  review: _review = null,
  reviewId,
  organizationId,
  isOpen,
  toggle,
  onDelete,
  refetchQueries,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  ...props
}) => {
  const [review, setReview] = useState(_review);
  const [initialValues, setInitialValues] = useState(unless(isNil, getInitialValues, _review));
  return (
    <Composer
      components={[
        /* eslint-disable react/no-children-prop */
        <Query
          {...{ fetchPolicy }}
          query={Queries.REVIEW_CARD}
          variables={{ _id: reviewId }}
          skip={!!_review}
          onCompleted={(data) => {
            const newReview = getReview(data);
            setReview(newReview);
            setInitialValues(getInitialValues(newReview));
          }}
          children={noop}
        />,
        <Mutation
          mutation={Mutations.UPDATE_REVIEW}
          children={noop}
          onCompleted={({ updateReview }) => setReview(updateReview)}
        />,
        <Mutation
          {...{ refetchQueries }}
          mutation={Mutations.REMOVE_REVIEW}
          children={noop}
        />,
        /* eslint-enable react/no-children-prop */
      ]}
    >
      {([
        { loading, error },
        updateReview,
        deleteReview,
      ]) => renderComponent({
        ...props,
        error,
        organizationId,
        isOpen,
        toggle,
        initialValues,
        review,
        loading,
        onSubmit: async (values, form) => {
          const currentValues = getInitialValues(review);
          const difference = diff(values, currentValues);

          if (!difference) return undefined;

          const {
            scheduledDate,
            reviewedAt,
            comments = '',
            reviewedBy: { value: reviewedBy },
          } = values;

          return updateReview({
            variables: {
              input: {
                _id: review._id,
                scheduledDate,
                reviewedAt,
                comments,
                reviewedBy,
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
            text: `The review "${review.title}" will be deleted`,
            confirmButtonText: 'Delete',
            successTitle: 'Deleted!',
            successText: `The review "${review.title}" was deleted successfully.`,
          }, () => deleteReview({
            variables: {
              input: { _id: review._id },
            },
          })).then(toggle || noop);
        },
      })}
    </Composer>
  );
};

ReviewEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  reviewId: PropTypes.string,
  review: PropTypes.object,
  fetchPolicy: PropTypes.string,
};

export default React.memo(ReviewEditContainer);
