import React from 'react';

class LHSListItem extends React.Component {
  constructor(props) {
    super(props);

    const { collapsed = true } = props;

    this.state = { collapsed };

    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.onCollapseShown = props.onCollapseShown.bind(this);
    this.onCollapseHidden = props.onCollapseHidden.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.shouldCollapse(nextProps) || !!(
      (this.state.collapsed && !nextState.collapsed) ||
      (!this.state.collapsed && nextState.collapsed)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.shouldCollapse(nextProps)) {
      this.toggleCollapse();
    }
  }

  componentDidMount() {
    const { item } = this.props;

    const collapse = $(this.collapse);

    const toggleCollapseState = (fn) => this.setState({
      collapsed: !this.state.collapsed
    }, fn);

    collapse.on('shown.bs.collapse', e => toggleCollapseState(() => this.onCollapseShown(e, item, this.state.collapsed)));

    collapse.on('hidden.bs.collapse', e => toggleCollapseState(() => this.onCollapseHidden(e, item, this.state.collapsed)));
  }

  render() {
    return (
      <div>
        <a className={
          `list-group-item
           list-group-subheading
           list-group-toggle
           pointer
           ${this.state.collapsed && 'collapsed'}`}
           onClick={this.toggleCollapse}>
          <h4 className="list-group-item-heading pull-left">{this.props.lText}</h4>
          {this.props.rText && (
            <p className="list-group-item-text text-danger pull-right">
              {this.props.rText}
            </p>
          )}
        </a>
        <div
          className={`list-group-collapse collapse ${!this.state.collapsed && 'in'}`}
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
      (this.state.collapsed && !nextProps.collapsed) ||
      (!this.state.collapsed && nextProps.collapsed)
    );
  }

  toggleCollapse() {
    $(this.collapse).collapse('toggle');
  }
}

export default LHSListItem;
