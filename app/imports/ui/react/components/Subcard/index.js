import React, { PropTypes } from 'react';
import cx from 'classnames';

import withContextCollapsed from '../../helpers/withContextCollapsed';
import CollapseBlock from '../CollapseBlock';
import Label from '../Labels/Label';
import ErrorSection from '../ErrorSection';
import Footer from './Footer';
import { Pull } from '../Utility';

const enhance = withContextCollapsed(({ collapsed = true }) => collapsed);

const Subcard = enhance(({
  collapsed,
  onToggleCollapse,
  errorText,
  isNew,
  renderLeftContent,
  renderRightContent,
  children,
}) => {
  const props = {
    isNew,
    errorText,
    collapsed,
    onToggleCollapse,
  };
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
        {renderLeftContent(props)}
        {isNew && (<Label names="primary">New</Label>)}
        {!!renderRightContent && (
          <Pull right>
            {renderRightContent(props)}
          </Pull>
        )}
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
  renderLeftContent: PropTypes.func.isRequired,
  renderRightContent: PropTypes.func,
  children: PropTypes.node,
};

Subcard.Footer = Footer;

export default Subcard;
