import React from 'react';
import { shallowEqual } from 'recompose';

class LHSListItem extends React.Component {
  constructor(props) {
    super(props);

    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.onToggleCollapse = props.onToggleCollapse.bind(this);
    this.onMount = props.onMount && props.onMount.bind(this);
    this.onCollapseShow = props.onCollapseShow && props.onCollapseShow.bind(this);
    this.onCollapseShown = props.onCollapseShown && props.onCollapseShown.bind(this);
    this.onCollapseHide = props.onCollapseHide && props.onCollapseHide.bind(this);
    this.onCollapseHidden = props.onCollapseHidden && props.onCollapseHidden.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return !shallowEqual(this.props, nextProps);
  }

  componentWillReceiveProps(nextProps) {
    if (this.shouldCollapse(nextProps)) {
      this.toggleCollapse();
    }
  }

  componentDidMount() {
    const collapse = $(this.collapse);

    if (this.props.shouldCollapseOnMount && !this.props.collapsed) {
      this.toggleCollapse(null, this.props);
    }

    collapse.on('show.bs.collapse', this.onCollapseShow);

    collapse.on('shown.bs.collapse', this.onCollapseShown);

    collapse.on('hide.bs.collapse', this.onCollapseHide);

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
           onClick={e => this.onToggleCollapse(e, this.props)}>
          <h4 className="list-group-item-heading pull-left">{this.props.lText}</h4>
          {this.props.rText && (
            <p className="list-group-item-text text-danger pull-right">
              {this.props.rText}
            </p>
          )}
        </a>
        <div
          className="list-group-collapse collapse"
          ref={c => this.collapse = c}>
          <div className="list-group">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  shouldCollapse(nextProps) {
    return !!(
      (this.props.collapsed && !nextProps.collapsed) ||
      (!this.props.collapsed && nextProps.collapsed)
    );
  }

  toggleCollapse() {
    $(this.collapse).collapse('toggle');
  }
}

export default LHSListItem;
