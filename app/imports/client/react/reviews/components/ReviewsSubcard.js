import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Col } from 'reactstrap';

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
} from '../../components';
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
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>Reviews</CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>{reviews.length || ''}</CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col sm={12}>
          <EntityManager>
            {reviews.map(review => (
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

ReviewsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  reviews: PropTypes.array.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  linkedTo: PropTypes.object,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
};

export default ReviewsSubcard;
