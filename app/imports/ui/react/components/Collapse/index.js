import React from 'react';
import cx from 'classnames';
import { $ } from 'meteor/jquery';
import { pure } from 'recompose';
import { _ } from 'meteor/underscore';

import propTypes from './propTypes';

@pure()
export default class Collapse extends React.Component {
  static get propTypes() {
    return propTypes;
  }

  constructor(props) {
    super(props);

    this.toggleCollapse = _.throttle(this.toggleCollapse, 400).bind(this);
    this.onToggleCollapse = _.throttle(props.onToggleCollapse, 400).bind(this);
    this.onCollapseShow = props.onCollapseShow && props.onCollapseShow.bind(this);
    this.onCollapseShown = props.onCollapseShown && props.onCollapseShown.bind(this);
    this.onCollapseHide = props.onCollapseHide && props.onCollapseHide.bind(this);
    this.onCollapseHidden = props.onCollapseHidden && props.onCollapseHidden.bind(this);
  }

  componentDidMount() {
    const collapse = $(this.collapse);
    const {
      shouldCollapseOnMount = true,
      collapsed = true,
    } = this.props;

    if (shouldCollapseOnMount && !collapsed) {
      collapse.collapse('show');
    }

    collapse.on('show.bs.collapse', this.onCollapseShow);

    collapse.on('shown.bs.collapse', this.onCollapseShown);

    collapse.on('hide.bs.collapse', this.onCollapseHide);

    collapse.on('hidden.bs.collapse', this.onCollapseHidden);
  }

  componentWillUpdate(nextProps) {
    if (this.props.collapsed && !nextProps.collapsed ||
        !this.props.collapsed && nextProps.collapsed) {
      this.toggleCollapse();
    }
  }

  toggleCollapse() {
    $(this.collapse).collapse('toggle');
  }

  render() {
    const {
      collapsed,
      children,
      classNames: {
        head = 'list-group-item list-group-subheading list-group-toggle pointer',
        body = 'list-group-collapse collapse',
        wrapper = '',
      } = {},
    } = this.props;

    return (
      <div className={wrapper}>
        <a
          onClick={this.onToggleCollapse}
          className={cx(head, { collapsed })}
        >
          {children[0]}
        </a>

        <div
          ref={node => (this.collapse = node)}
          className={body}
        >
          {children[1]}
        </div>
      </div>
    );
  }
}
