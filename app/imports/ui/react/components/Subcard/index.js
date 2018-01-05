import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import withContextCollapsed from '../../helpers/withContextCollapsed';
import CollapseBlock from '../CollapseBlock';
import Label from '../Labels/Label';
import ErrorSection from '../ErrorSection';
import Footer from './Footer';

const enhance = withContextCollapsed(({ collapsed = true }) => collapsed);

const Subcard = enhance(({
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
          {children}
        </div>
      </div>
    </CollapseBlock>
  );
});

Subcard.propTypes = {
  collapsed: PropTypes.bool,
  errorText: PropTypes.string,
  isNew: PropTypes.bool,
  leftText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  rightText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
};

Subcard.Footer = Footer;

export default Subcard;
