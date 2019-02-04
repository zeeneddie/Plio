import PropTypes from 'prop-types';
import { Component } from 'react';
import { noop } from 'plio-util';

export default class Lifecycle extends Component {
  static defaultProps = {
    didMount: noop,
    shouldUpdate: noop,
    getSnapshotBeforeUpdate: noop,
    didUpdate: noop,
    willUnmount: noop,
    didCatch: noop,
  };

  static propTypes = {
    didMount: PropTypes.func,
    shouldUpdate: PropTypes.func,
    getSnapshotBeforeUpdate: PropTypes.func,
    didUpdate: PropTypes.func,
    willUnmount: PropTypes.func,
    didCatch: PropTypes.func,
    children: PropTypes.node.isRequired,
  }

  componentDidMount() {
    return this.props.didMount(this.props);
  }

  shouldComponentUpdate(nextProps) {
    const result = this.props.shouldUpdate(nextProps, this.props);
    return typeof result === 'boolean' ? result : true;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    return this.props.didUpdate(this.props, prevProps, snapshot);
  }

  componentWillUnmount() {
    return this.props.willUnmount(this.props);
  }

  getSnapshotBeforeUpdate(prevProps) {
    return this.props.getSnapshotBeforeUpdate(prevProps, this.props) || null;
  }

  componentDidCatch(error, info) {
    return this.props.didCatch(error, info, this.props);
  }

  render() {
    return this.props.children;
  }
}
