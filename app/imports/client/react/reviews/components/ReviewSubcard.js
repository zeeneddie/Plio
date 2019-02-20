import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import { getFormattedDate } from '../../../../share/helpers';
import { EntityForm, EntityCard } from '../../components';
import ReviewForm from './ReviewForm';

const ReviewSubcard = ({
  review,
  onSubmit,
  organizationId,
  initialValues,
  isOpen,
  toggle,
  onDelete,
  ...rest
}) => (
  <Fragment>
    <Card>
      <EntityForm
        {...{
          isOpen,
          toggle,
          onDelete,
          onSubmit,
          initialValues,
        }}
        label={(
          <Fragment>
            <strong>Review on {getFormattedDate(review.reviewedAt)}</strong>
          </Fragment>
        )}
        component={EntityCard}
      >
        {({ handleSubmit }) => (
          <ReviewForm
            {...{ organizationId, ...rest }}
            save={handleSubmit}
          />
        )}
      </EntityForm>
    </Card>
  </Fragment>
);

ReviewSubcard.propTypes = {
  review: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default ReviewSubcard;
