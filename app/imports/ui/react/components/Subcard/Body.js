import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'reactstrap';
import cx from 'classnames';
import { withState, compose, shouldUpdate } from 'recompose';

const enhance = compose(
  withState('collapsing', 'setCollapsing', false),
  shouldUpdate((props, nextProps) => !!(
    props.collapsing !== nextProps.collapsing ||
    props.isOpen !== nextProps.isOpen
  )),
);

const SubcardBody = enhance(({
  children,
  isOpen,
  className,
  collapsing,
  setCollapsing,
  ...props
}) => (
  <Collapse
    className={cx(
      className,
      'card-block-collapse',
      { collapsing, in: isOpen },
    )}
    onEntering={() => setCollapsing(true)}
    onExiting={() => setCollapsing(true)}
    onEntered={() => setCollapsing(false)}
    onExited={() => setCollapsing(false)}
    {...{ isOpen, ...props }}
  >
    {children}
  </Collapse>
));

SubcardBody.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default SubcardBody;
