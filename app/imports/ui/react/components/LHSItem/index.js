import React from 'react';

import { propEq } from '/imports/api/helpers';
import CollapseBlock from '../../components/CollapseBlock';
import propTypes from './propTypes';

const isCollapsed = props => !props.collapsed.find(propEq('key', props.item.key));

const LHSItem = (props) => (
  <CollapseBlock
    collapsed={isCollapsed(props)}
    onToggleCollapse={e => props.onToggleCollapse(e, props.item)}
  >
    <div>
      <h4 className="list-group-item-heading pull-left">{props.lText}</h4>
      {!!props.rText && (isCollapsed(props) && !props.hideRTextOnExpand) && (
        <p
          className="list-group-item-text text-danger pull-right"
        >
          {props.rText}
        </p>
      )}
    </div>
    <div className="list-group">
      {props.children}
    </div>
  </CollapseBlock>
);

LHSItem.propTypes = propTypes;

export default LHSItem;
