import React, { PropTypes } from 'react';
import cx from 'classnames';
import { prop } from 'ramda';
import { branch, withProps } from 'recompose';

import withContextCollapsed from '../../helpers/withContextCollapsed';
import CollapseBlock from '../CollapseBlock';
import Label from '../Labels/Label';
import ErrorSection from '../ErrorSection';
import Footer from './Footer';
import { Pull } from '../Utility';

const enhance = branch(
  prop('disabled'),
  withProps(() => ({
    collapsed: false,
    onToggleCollapse: () => null,
    chevron: false,
  })),
  withContextCollapsed(({ collapsed = true }) => collapsed),
);

const Subcard = enhance(({
  collapsed,
  onToggleCollapse,
  errorText,
  isNew,
  renderLeftContent,
  renderRightContent,
  children,
  ...otherProps
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
    <CollapseBlock
      tag="div"
      {...{
        collapsed,
        onToggleCollapse,
        classNames,
        ...otherProps,
      }}
    >
      <div>
        {renderLeftContent(props)}
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
  disabled: PropTypes.bool,
};

Subcard.Footer = Footer;

export default Subcard;
