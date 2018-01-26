import PropTypes from 'prop-types';
import React from 'react';
import { branch } from 'recompose';
import { converge, gt, prop, identity, map, splitEvery, either } from 'ramda';
import styled from 'styled-components';
import { getItemsLength } from 'plio-util';

import { DashboardStats, Collapse, ToggleAngleIcon } from './';
import { withStateToggle, omitProps } from '../helpers';

const StyledDashboardTitle = styled(({ toggle, ...rest }) => <DashboardStats.Title {...rest} />)`
  cursor: ${({ toggle }) => toggle ? 'pointer' : 'auto'};
  text-decoration: none;
`;

StyledDashboardTitle.displayName = 'DashboardStatsTitle';

const itemsExceedLimit = converge(gt, [
  either(prop('total'), getItemsLength),
  prop('itemsPerRow'),
]);

export const enhance = branch(
  itemsExceedLimit,
  branch(
    prop('toggle'),
    identity,
    withStateToggle(false, 'isOpen', 'toggle'),
  ),
  omitProps(['toggle', 'isOpen']),
);

export const DashboardStatsExpandable = ({
  items,
  isOpen,
  toggle,
  itemsPerRow,
  render,
  renderIcon = ToggleAngleIcon,
  children,
}) => (
  <DashboardStats>
    <StyledDashboardTitle onClick={toggle} {...{ toggle }}>
      {children}
      {' '}
      {!!toggle && renderIcon({ isOpen, toggle })}
    </StyledDashboardTitle>
    {render({ items: items.slice(0, itemsPerRow) })}

    {!!toggle && (
      <Collapse {...{ isOpen }}>
        {map(
          splitItems => render({ items: splitItems }),
          splitEvery(itemsPerRow, items.slice(itemsPerRow)),
        )}
      </Collapse>
    )}
  </DashboardStats>
);

DashboardStatsExpandable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemsPerRow: PropTypes.number.isRequired,
  render: PropTypes.func.isRequired,
  renderIcon: PropTypes.func,
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  total: PropTypes.number,
};

export default enhance(DashboardStatsExpandable);
