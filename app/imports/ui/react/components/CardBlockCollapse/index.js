import React, { PropTypes } from 'react';
import { CardTitle } from 'reactstrap';

import withStateCollapsed from '../../helpers/withStateCollapsed';
import CollapseBlock from '../CollapseBlock';
import IconLoading from '../Icons/IconLoading';

const CardBlockCollapse = withStateCollapsed(true)(({
  collapsed,
  onToggleCollapse,
  leftText,
  rightText,
  loading,
  children,
}) => {
  let rightContent = null;
  const classNames = {
    head: 'card-block card-block-collapse-toggle',
    body: 'card-block-collapse collapse',
  };

  if (loading) rightContent = <IconLoading margin="bottom" />;

  else if (rightText) rightContent = <span className="text-muted">{rightText}</span>;

  return (
    <CollapseBlock {...{ classNames, collapsed, onToggleCollapse }} tag="div">
      <div>
        <CardTitle className="pull-xs-left">{leftText}</CardTitle>
        <CardTitle className="pull-xs-right">
          {rightContent}
        </CardTitle>
      </div>
      {children}
    </CollapseBlock>
  );
});

CardBlockCollapse.propTypes = {
  leftText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  loading: PropTypes.bool,
  children: PropTypes.node,
};

export default CardBlockCollapse;
