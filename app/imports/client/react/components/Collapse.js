import React from 'react';
import PropTypes from 'prop-types';
import { Collapse as Collapsible } from 'reactstrap';
import cx from 'classnames';

class Collapse extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props);

    this.setCollapsing = this.setCollapsing.bind(this);
  }

  state = {
    collapsing: false,
  }

  setCollapsing(collapsing) {
    return () => this.setState({ collapsing });
  }

  render() {
    const { collapsing } = this.state;
    const {
      isOpen,
      children,
      className,
      ...props
    } = this.props;
    return (
      <Collapsible
        className={cx(className, { collapsing, in: isOpen })}
        onEntering={this.setCollapsing(true)}
        onExiting={this.setCollapsing(true)}
        onEntered={this.setCollapsing(false)}
        onExited={this.setCollapsing(false)}
        {...{ isOpen, ...props }}
      >
        {children}
      </Collapsible>
    );
  }
}

export default Collapse;
