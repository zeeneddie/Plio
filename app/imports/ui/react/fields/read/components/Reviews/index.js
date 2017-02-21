import React, { PropTypes } from 'react';

import { getFullNameOrEmail } from '/imports/api/users/helpers';
import { getFormattedDate } from '/imports/share/helpers';
import { mapC } from '/imports/api/helpers';
import Field from '../Field';

const renderReviews = mapC(({ reviewedAt, reviewedBy, comments }) => (
  <Field>
    Document reviewed by
    {getFullNameOrEmail(reviewedBy)}
    on {getFormattedDate(reviewedAt)}
    with comments "{comments}"
  </Field>
));

const Reviews = ({ reviews }) => (
  <div>
    {renderReviews(reviews)}
  </div>
);

Reviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    reviewedAt: PropTypes.instanceOf(Date),
    reviewedBy: PropTypes.object,
    comments: PropTypes.string,
  })),
};

export default Reviews;
