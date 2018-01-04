import PropTypes from 'prop-types';
import React from 'react';
import { branch } from 'recompose';
import { converge, gt, prop, identity, map, splitEvery, tap, compose } from 'ramda';

import { DashboardStats, Collapse, PlusButton } from './';
import { withStateToggle } from '../helpers';
import { getItemsLength } from '../../../client/util';

const itemsExceedLimit = converge(gt, [
  getItemsLength,
  prop('itemsPerRow'),
]);

export const enhance = branch(
  prop('toggle'),
  identity,
  branch(
    compose(itemsExceedLimit),
    withStateToggle(false, 'isOpen', 'toggle'),
    identity,
  ),
);

export const DashboardStatsExpandable = ({
  items,
  isOpen,
  toggle,
  itemsPerRow,
  render,
  // eslint-disable-next-line react/prop-types
  renderButton = ({ isOpen: open }) => (
    <PlusButton size="1" onClick={toggle} minus={open} />
  ),
  children,
}) => !!items.length && (
  <DashboardStats>
    <DashboardStats.Title>
      {!!toggle && renderButton({ isOpen, toggle })}
      {children}
    </DashboardStats.Title>
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
  children: PropTypes.node,
};

export default enhance(DashboardStatsExpandable);
