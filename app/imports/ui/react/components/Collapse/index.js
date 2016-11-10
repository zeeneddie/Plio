import React from 'react';
import cx from 'classnames';

import propTypes from './propTypes';

const Collapse = ({
  onToggleCollapse,
  children,
  collapsed = true,
  classNames: {
    head = 'list-group-item list-group-subheading list-group-toggle pointer',
    body = 'list-group-collapse collapse',
  } = {},
}) => (
  <div>
    <a
      onClick={onToggleCollapse}
      className={cx(head, { collapsed })}
    >
      {children[0]}
    </a>

    <div
      className={cx(body, { in: !collapsed })}
    >
      {children[1]}
    </div>
  </div>
);

Collapse.propTypes = propTypes;

export default Collapse;
