import React from 'react';
import { mount } from 'enzyme';
import { times } from 'ramda';

import { DashboardStatsOverdueItems } from '../DashboardStatsOverdueItems';

describe('DashboardStatsOverdueItems', () => {
  it('renders correctly', () => {
    const workItems = times(_id => ({ _id }), 25);
    const itemsPerRow = 5;
    const orgSerialNumber = 1;
    const count = workItems.length;
    const toggle = jest.fn();
    const isOpen = false;
    const loading = false;
    const wrapper = mount(
      <DashboardStatsOverdueItems
        {...{
          workItems,
          itemsPerRow,
          orgSerialNumber,
          count,
          toggle,
          isOpen,
          loading,
        }}
      />,
    );

    expect(wrapper).toMatchSnapshot();
  });
});
