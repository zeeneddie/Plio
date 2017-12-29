import React from 'react';
import { mount } from 'enzyme';
import { times } from 'ramda';

import DashboardUserStats from '../DashboardUserStats';
import DashboardStatsUserList from '../DashboardStatsUserList';
import { Collapse } from '../../../components';

describe('DashboardUserStats', () => {
  it('renders collapse when more than 5 users online', () => {
    const users = times(n => ({
      _id: n,
      status: 'online',
      profile: {
        firstName: `John ${n}`,
        lastName: `Doe ${n}`,
      },
    }), 10);
    const usersPerRow = 5;
    const wrapper = mount(<DashboardUserStats {...{ users, usersPerRow }} />);
    expect(wrapper.contains(Collapse)).toBe(true);
    expect(wrapper.find(DashboardStatsUserList)).toHaveLength(2);
  });
});
