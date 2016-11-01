import React from 'react';
import ReactDOM from 'react-dom';
import { compose, withState, withHandlers, lifecycle } from 'recompose';

import { not, T, F } from '/imports/api/helpers';

const LHSListItem = (props) => {
  let collapse;

  return (
    <div>
      <a className={
        `list-group-item
         list-group-subheading
         list-group-toggle
         pointer
         ${props.collapsed && 'collapsed'}`}
         onClick={e => $(collapse).collapse('toggle')}>
        <h4 className="list-group-item-heading pull-left">{props.lText}</h4>
        {props.rText && (
          <p className="list-group-item-text text-danger pull-right">
            {props.rText}
          </p>
        )}
      </a>
      <div
        className="list-group-collapse collapse"
        ref={c => collapse = c}>
        <div className="list-group">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default compose(
  withState('collapsed', 'setCollapsed', true),
  withHandlers({
    toggleCollapse: props => e => props.setCollapsed(not)
  }),
  lifecycle({
    componentDidMount() {
      const { setCollapsed } = this.props;

      const collapse = $(ReactDOM.findDOMNode(this)).children('.collapse');

      collapse.on('shown.bs.collapse', e => setCollapsed(F));

      collapse.on('hidden.bs.collapse', e => setCollapsed(T));
    }
  })
)(LHSListItem);
