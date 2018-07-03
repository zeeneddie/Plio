/* eslint-disable react/prop-types */

import React from 'react';
import { shallow } from 'enzyme';
import { times } from 'ramda';
import { joinIds } from 'plio-util';

import { DashboardStatsExpandable } from '../DashboardStatsExpandable';
import { Collapse } from '../../components';

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

    const title = wrapper.find('DashboardStatsTitle');
    expect(title).toHaveLength(1);
    title.simulate('click');
    expect(toggle).toHaveBeenCalled();

    expect(wrapper).toMatchSnapshot();
  });
});
