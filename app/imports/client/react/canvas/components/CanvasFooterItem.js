import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const CanvasFooterItem = ({ title, sequentialId }) => (
  <Fragment>
    <span className="text-muted">{sequentialId}</span>
    {' '}
    <span>{title}</span>
  </Fragment>
);

CanvasFooterItem.propTypes = {
  title: PropTypes.string.isRequired,
  sequentialId: PropTypes.string.isRequired,
};

export default CanvasFooterItem;
