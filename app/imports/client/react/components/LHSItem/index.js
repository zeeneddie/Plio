import PropTypes from 'prop-types';
import React from 'react';

import { propEqKey } from '/imports/api/helpers';
import CollapseBlock from '../CollapseBlock';

const propTypeItem = PropTypes.shape({
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string.isRequired,
});

const propTypes = {
  collapsed: PropTypes.arrayOf(propTypeItem).isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  children: PropTypes.node,
  lText: PropTypes.string.isRequired,
  rText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  hideRTextOnExpand: PropTypes.bool,
  item: propTypeItem,
};

const LHSItem = ({
  item,
  collapsed,
  onToggleCollapse,
  lText,
  rText,
  hideRTextOnExpand,
  children,
}) => {
  let rContent = null;
  const isCollapsed = !collapsed.find(propEqKey(item.key));
  if (rText && (hideRTextOnExpand && !isCollapsed) || !hideRTextOnExpand) {
    rContent = rText;

    if (typeof rText === 'string') {
      rContent = (
        <p
          className="list-group-item-text text-danger pull-right"
        >
          {rText}
        </p>
      );
    }
  }

  return (
    <CollapseBlock
      collapsed={isCollapsed}
      onToggleCollapse={e => onToggleCollapse(e, item)}
    >
      <div>
        <h4 className="list-group-item-heading pull-left">{lText}</h4>
        <span className="pull-right">{rContent}</span>
      </div>
      <div className="list-group">
        {children}
      </div>
    </CollapseBlock>
  );
};

LHSItem.propTypes = propTypes;

export default LHSItem;
