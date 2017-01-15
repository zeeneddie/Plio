import React, { PropTypes } from 'react';

import Subcard from '../../../../components/Subcard';
import ReviewConfig from '../Config';

const ReviewSubcard = ({ organization: { review }, ...rest }) => (
  <Subcard {...rest}>
    <Subcard.Title>
      <Subcard.TitleItem pull="left">
        Review
      </Subcard.TitleItem>
    </Subcard.Title>

    <Subcard.Content>
      <legend>Standards</legend>
      <ReviewConfig
        config={review.standards}
        documentKey="standards"
        {...rest}
      />

      <legend>Risks</legend>
      <ReviewConfig
        config={review.risks}
        documentKey="risks"
        {...rest}
      />
    </Subcard.Content>
  </Subcard>
);

/*ReviewSubcard.propTypes = {
  loading: PropTypes.bool,
  onFieldChangeHandler: PropTypes.func,
  organization: PropTypes.object,
  isHelpCollapsed: PropTypes.bool,
  setIsHelpCollapsed: PropTypes.func,
};*/

export default ReviewSubcard;
