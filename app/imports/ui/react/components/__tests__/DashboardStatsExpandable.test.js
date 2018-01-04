/* eslint-disable react/prop-types */

import React from 'react';
import { shallow } from 'enzyme';
import { times } from 'ramda';

import { joinIds } from '../../../../client/util';
import { DashboardStatsExpandable } from '../DashboardStatsExpandable';
import { Collapse, DashboardStats, PlusButton } from '../';

describe('DashboardStatsExpandable', () => {
  it('renders correctly', () => {
    const len = 25;
    const items = times(_id => ({ _id }), len);
    const itemsPerRow = 5;
    const render = ({ items: receivedItems }) => (
      <div key={joinIds(receivedItems)}>foo</div>
    );
    const toggle = jest.fn();
    const isOpen = false;
    const component = (
      <DashboardStatsExpandable
        {...{
          items,
          itemsPerRow,
          isOpen,
          toggle,
          render,
        }}
      />
    );
    const wrapper = shallow(component);

    expect(wrapper.find(Collapse)).toHaveLength(1);
    expect(wrapper.find(Collapse).find('div')).toHaveLength(len / itemsPerRow - 1);

    const button = wrapper.find(DashboardStats.Title).find(PlusButton);
    expect(button).toHaveLength(1);
    button.simulate('click');
    expect(toggle).toHaveBeenCalled();
    wrapper.setProps({ isOpen: true });
    const btn = <PlusButton size="1" onClick={toggle} minus />;
    expect(wrapper.find(DashboardStats.Title).contains(btn)).toBe(true);

    expect(wrapper).toMatchSnapshot();
  });
});
