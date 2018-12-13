import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const CanvasStandardFooterItem = ({ title, issueNumber, type: { abbreviation } = {} }) => (
  <Fragment>
    <span className="text-muted">
      {abbreviation && (
        <Fragment>
          {abbreviation}
          {issueNumber}
        </Fragment>
      )}
    </span>
    {' '}
    <span>{title}</span>
  </Fragment>
);

CanvasStandardFooterItem.propTypes = {
  title: PropTypes.string.isRequired,
  issueNumber: PropTypes.node,
  type: PropTypes.shape({
    abbreviation: PropTypes.string,
  }),
};

export default CanvasStandardFooterItem;
