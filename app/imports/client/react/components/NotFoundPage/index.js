import React from 'react';
import PropTypes from 'prop-types';

import ErrorPage from '../ErrorPage';

const NotFoundPage = ({ subject, subjectId }) => (
  <ErrorPage error={`You have no access to ${subject} ${subjectId}`} />
);

NotFoundPage.propTypes = {
  subject: PropTypes.string,
  subjectId: PropTypes.string,
};

export default NotFoundPage;
