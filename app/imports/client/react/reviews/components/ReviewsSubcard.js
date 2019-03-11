import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Col } from 'reactstrap';
import { sort } from 'ramda';
import { byReviewedAt } from 'plio-util';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
  EntityManager,
  EntityManagerItem,
  EntityManagerAddButton,
  EntityManagerForms,
  EntityManagerCards,
  EntityManagerCard,
  Icon,
} from '../../components';
import { getClassByStatus } from '../helpers';
import ReviewEditContainer from '../containers/ReviewEditContainer';
import ReviewSubcard from './ReviewSubcard';
import ReviewAddFormWrapper from './ReviewAddFormWrapper';
import ReviewForm from './ReviewForm';

const ReviewsSubcard = ({
  organizationId,
  reviews,
  linkedTo,
  onLink,
  onUnlink,
  documentType,
  refetchQueries,
  reviewWorkflow,
}) => {
  const sortedReviews = useMemo(() => sort(byReviewedAt, reviews), [reviews]);
  return (
    <Subcard>
      <SubcardHeader>
        <Pull left>
          <CardTitle>Reviews</CardTitle>
        </Pull>
        <Pull right>
          <CardTitle>
            {reviews.length || ''}
            {' '}
            <Icon name="circle" className={`text-${getClassByStatus(reviewWorkflow.status)}`} />
          </CardTitle>
        </Pull>
      </SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <Col sm={12}>
            <EntityManager>
              {sortedReviews.map(review => (
                <EntityManagerItem
                  {...{
                    organizationId,
                    review,
                    linkedTo,
                    onUnlink,
                    refetchQueries,
                  }}
                  key={review._id}
                  itemId={review._id}
                  component={ReviewEditContainer}
                  render={ReviewSubcard}
                />
              ))}
              <EntityManagerForms>
                <EntityManagerCards
                  {...{
                    documentId: linkedTo._id,
                    organizationId,
                    documentType,
                    onLink,
                    onUnlink,
                    refetchQueries,
                    reviewWorkflow,
                  }}
                  keepDirtyOnReinitialize
                  label="New review"
                  component={ReviewAddFormWrapper}
                  render={EntityManagerCard}
                >
                  <ReviewForm {...{ organizationId }} />
                </EntityManagerCards>
                <EntityManagerAddButton>Add a new review</EntityManagerAddButton>
              </EntityManagerForms>
            </EntityManager>
          </Col>
        </CardBlock>
      </SubcardBody>
    </Subcard>
  );
};

ReviewsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  reviews: PropTypes.array.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  linkedTo: PropTypes.object,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  reviewWorkflow: PropTypes.object,
};

export default ReviewsSubcard;
