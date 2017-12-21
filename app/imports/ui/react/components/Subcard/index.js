import React, { PropTypes } from 'react';
import cx from 'classnames';
import { prop } from 'ramda';
import { withProps, branch, compose, lifecycle, mapProps } from 'recompose';

import withStateCollapsed from '../../helpers/withStateCollapsed';
import CollapseBlock from '../CollapseBlock';
import ErrorSection from '../ErrorSection';
import { Pull } from '../Utility';
import Footer from './Footer';
import AddNewDocument from './AddNewDocument';
import SwitchView from './SwitchView';

const enhance = branch(
  prop('disabled'),
  withProps(() => ({
    chevron: false,
    collapsed: false,
    onToggleCollapse: () => null,
  })),
  compose(
    withStateCollapsed(({ collapsed = true }) => collapsed),
    mapProps(({
      children,
      collapsed,
      onToggleCollapse,
      ...props
    }) => ({
      ...props,
      collapsed,
      onToggleCollapse,
      children: React.Children.map(children, (child) => {
        if (child.type === Footer) {
          return React.cloneElement(child, { collapsed, onToggleCollapse });
        }

        return child;
      }),
    })),
  ),
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
Subcard.AddNewDocument = AddNewDocument;
Subcard.SwitchView = SwitchView;

export default Subcard;
