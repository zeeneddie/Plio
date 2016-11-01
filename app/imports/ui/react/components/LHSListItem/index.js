import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withState, withHandlers, lifecycle, withPropsOnChange } from 'recompose';

import { not, T, F } from '/imports/api/helpers';

class LHSListItem extends React.Component {
  constructor(props) {
    super(props);

    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.onCollapseShown = props.onCollapseShown.bind(this);
    this.onCollapseHidden = props.onCollapseHidden.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return !!(
      !this.props.collapsed && nextProps.collapsed ||
      this.props.collapsed && !nextProps.collapsed
    );
  }

  componentWillReceiveProps(nextProps) {
    if ((!this.props.collapsed && nextProps.collapsed) ||
        (this.props.collapsed && !nextProps.collapsed)) {
      this.toggleCollapse();
    }
  }

  componentDidMount() {
    const collapse = $(this.collapse);

    collapse.on('shown.bs.collapse', e => this.onCollapseShown(e, this));

    collapse.on('hidden.bs.collapse', this.onCollapseHidden);
  }

  render() {
    return (
      <div>
        <a className={
          `list-group-item
           list-group-subheading
           list-group-toggle
           pointer
           ${this.props.collapsed && 'collapsed'}`}
           onClick={this.toggleCollapse}>
          <h4 className="list-group-item-heading pull-left">{this.props.lText}</h4>
          {this.props.rText && (
            <p className="list-group-item-text text-danger pull-right">
              {this.props.rText}
            </p>
          )}
        </a>
        <div
          className={`list-group-collapse collapse ${!this.props.collapsed && 'in'}`}
          ref={c => this.collapse = c}>
          <div className="list-group">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  toggleCollapse() {
    $(this.collapse).collapse('toggle');
  }
}

export default LHSListItem;
