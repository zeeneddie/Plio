import PropTypes from 'prop-types';
import React from 'react';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import cx from 'classnames';

export default class Collapse extends React.Component {
  static get propTypes() {
    return {
      collapsed: PropTypes.bool.isRequired,
      children: PropTypes.node,
      onCollapseShow: PropTypes.func,
      onCollapseShown: PropTypes.func,
      onCollapseHide: PropTypes.func,
      onCollapseHidden: PropTypes.func,
      className: PropTypes.string,
    };
  }

  constructor(props) {
    super(props);

    this.toggleCollapse = _.throttle(this.toggleCollapse, 400).bind(this);
    this.onCollapseShow = props.onCollapseShow && props.onCollapseShow.bind(this);
    this.onCollapseShown = props.onCollapseShown && props.onCollapseShown.bind(this);
    this.onCollapseHide = props.onCollapseHide && props.onCollapseHide.bind(this);
    this.onCollapseHidden = props.onCollapseHidden && props.onCollapseHidden.bind(this);
  }

  componentDidMount() {
    const { collapsed = true } = this.props;

    const collapse = $(this.collapse);

    if (!collapsed) {
      collapse.addClass('in');
    }

    collapse.on('show.bs.collapse', this.onCollapseShow);

    collapse.on('shown.bs.collapse', this.onCollapseShown);

    collapse.on('hide.bs.collapse', this.onCollapseHide);

    collapse.on('hidden.bs.collapse', this.onCollapseHidden);
  }

  componentWillUpdate(nextProps) {
    if (this.props.collapsed !== nextProps.collapsed) {
      this.toggleCollapse();
    }
  }

  toggleCollapse() {
    $(this.collapse).collapse('toggle');
  }

  render() {
    return (
      <div
        ref={node => (this.collapse = node)}
        className={cx('collapse', this.props.className)}
      >
        {this.props.children}
      </div>
    );
  }
}
