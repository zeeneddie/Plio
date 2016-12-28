import React, { PropTypes } from 'react';
import cx from 'classnames';

import withStateCollapsed from '../../helpers/withStateCollapsed';
import CollapseBlock from '../CollapseBlock';
import Label from '../Labels/Label';
import ErrorSection from '../ErrorSection';
import Footer from './Footer';

const Subcard = withStateCollapsed(true)(({
  collapsed,
  onToggleCollapse,
  errorText,
  isNew,
  leftText,
  rightText,
  children,
}) => {
  const classNames = {
    head: cx('card-block card-block-collapse-toggle', {
      'with-error': errorText,
      new: isNew,
    }),
    body: 'card-block-collapse collapse',
  };

  return (
    <CollapseBlock {...{ collapsed, onToggleCollapse, classNames }} tag="div">
      <div>
        <span>{leftText}</span>
        {isNew && (<Label names="primary">New</Label>)}
        <span className="pull-xs-right">{rightText}</span>
      </div>
      <div>
        <ErrorSection size="3" {...{ errorText }} />
        <div className="subcard-content">
          {React.cloneElement(children, { collapsed, onToggleCollapse })}
        </div>
      </div>
    </CollapseBlock>
  );
});

Subcard.propTypes = {
  errorText: PropTypes.string,
  isNew: PropTypes.bool,
  leftText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
};

Subcard.Footer = Footer;

export default Subcard;
