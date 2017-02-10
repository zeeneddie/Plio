import React, { PropTypes } from 'react';
import cx from 'classnames';
import { pure } from 'recompose';
import { _ } from 'meteor/underscore';

import Collapse from '../Collapse';

const handleToggleCollapse = _.throttle(onToggleCollapse => onToggleCollapse(), 400);

const CollapseBlock = ({
  collapsed,
  children,
  onToggleCollapse,
  tag = 'a',
  classNames: {
    head = 'list-group-item list-group-subheading list-group-toggle pointer',
    body = 'list-group-collapse collapse',
    wrapper = '',
  } = {},
  ...other,
}) => {
  const Tag = tag;

  return (
    <div className={wrapper}>
      <Tag
        onClick={() => handleToggleCollapse(onToggleCollapse)}
        className={cx(head, { collapsed })}
      >
        {children[0]}
      </Tag>
      <Collapse className={body} {...{ ...other, collapsed }}>
        {children[1]}
      </Collapse>
    </div>
  );
};

CollapseBlock.propTypes = {
  onToggleCollapse: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  classNames: PropTypes.shape({
    head: PropTypes.string,
    body: PropTypes.string,
    wrapper: PropTypes.string,
  }),
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  children: PropTypes.node.isRequired,
  onCollapseShow: PropTypes.func,
  onCollapseShown: PropTypes.func,
  onCollapseHide: PropTypes.func,
  onCollapseHidden: PropTypes.func,
};

export default pure(CollapseBlock);
