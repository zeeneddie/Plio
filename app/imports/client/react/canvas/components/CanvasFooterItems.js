import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import { DropdownItem } from 'reactstrap';

import CanvasLabel from './CanvasLabel';

const CanvasFooterItems = ({
  items,
  label,
  renderItem,
  onClick,
}) => {
  if (!items.length) return null;

  if (items.length === 1) {
    return (
      <CanvasLabel
        label={renderItem(items[0])}
        onClick={() => onClick(items[0])}
      />
    );
  }

  return (
    <CanvasLabel label={pluralize(label, items.length, true)}>
      {items.map(item => (
        <DropdownItem key={item._id} onClick={() => onClick(item)}>
          {renderItem(item)}
        </DropdownItem>
      ))}
    </CanvasLabel>
  );
};

CanvasFooterItems.propTypes = {
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  renderItem: PropTypes.func,
  onClick: PropTypes.func,
};

export default CanvasFooterItems;