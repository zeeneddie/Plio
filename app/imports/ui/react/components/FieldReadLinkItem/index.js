import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';

const FieldReadLinkItem = ({ href, indicator, title, sequentialId }) => (
  <a
    href={href}
    className="btn btn-secondary btn-inline pointer"
  >
    {sequentialId && (<strong>{sequentialId} </strong>)}

    <span>{title}</span>

    {indicator && (
      <i
        className={cx(
          'fa fa-circle margin-left',
          `text-${indicator}`
        )}
      ></i>
    )}
  </a>
);

FieldReadLinkItem.propTypes = propTypes;

export default FieldReadLinkItem;
