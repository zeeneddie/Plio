import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import { DropdownItem } from 'reactstrap';
import styled from 'styled-components';

import CanvasLabel from './CanvasLabel';
import { FlowRouterContext } from '../../components';
import { RouteNames, Styles } from '../../../../api/constants';

const StyledDropdownItem = styled(DropdownItem)`
  color: ${Styles.color.blue};
  &:hover {
    color: ${Styles.color.hoverBlue};
  }
`;

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
      <FlowRouterContext getParam="orgSerialNumber">
        {({ orgSerialNumber, router }) => (
          <StyledDropdownItem tag="a" href={router.path(RouteNames.DASHBOARD, { orgSerialNumber })}>
            Go to Operations view
          </StyledDropdownItem>
        )}
      </FlowRouterContext>
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
