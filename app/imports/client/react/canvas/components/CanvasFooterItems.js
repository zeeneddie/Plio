import React from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import { DropdownItem } from 'reactstrap';
import styled from 'styled-components';

import CanvasLabel from './CanvasLabel';
import { FlowRouterContext, Icon } from '../../components';
import { RouteNames, Styles } from '../../../../api/constants';

const ShortcutDropdownItem = styled(DropdownItem)`
  color: ${Styles.color.blue};
  &:hover {
    color: ${Styles.color.hoverBlue};
  }
`;

const LinkedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SpacedDiv = styled.div`
  margin-right: .7em;
`;

const UnlinkIcon = styled(({ onClick, ...props }) => (
  <Icon
    name="times-circle"
    size="2"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    {...props}
  />
))`
  &:hover {
    color: ${Styles.color.hoverBlue};
  }
`;

const CanvasFooterItems = ({
  items,
  label,
  renderItem,
  onClick,
  onDelete,
}) => {
  if (!items.length) return null;

  if (items.length === 1) {
    return (
      <CanvasLabel
        label={(
          <LinkedItem>
            <SpacedDiv>{renderItem(items[0])}</SpacedDiv>
            <UnlinkIcon onClick={() => onDelete(items[0])} />
          </LinkedItem>
        )}
        onClick={() => onClick(items[0])}
      />
    );
  }

  return (
    <CanvasLabel label={pluralize(label, items.length, true)}>
      {items.map(item => (
        <DropdownItem key={item._id} onClick={() => onClick(item)}>
          <LinkedItem>
            <div>{renderItem(item)}</div>
            <UnlinkIcon onClick={() => onDelete(item)} />
          </LinkedItem>
        </DropdownItem>
      ))}
      <FlowRouterContext getParam="orgSerialNumber">
        {({ orgSerialNumber, router }) => (
          <ShortcutDropdownItem
            tag="a"
            href={router.path(RouteNames.DASHBOARD, { orgSerialNumber })}
          >
            Shortcut to Operations view
          </ShortcutDropdownItem>
        )}
      </FlowRouterContext>
    </CanvasLabel>
  );
};

CanvasFooterItems.propTypes = {
  items: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  renderItem: PropTypes.func,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CanvasFooterItems;
