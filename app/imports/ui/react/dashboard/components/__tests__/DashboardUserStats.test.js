import React from 'react';
import { mount } from 'enzyme';
import { times } from 'ramda';

import { DashboardUserStats } from '../DashboardUserStats';
import DashboardStatsUserList from '../DashboardStatsUserList';
import { Collapse } from '../../../components';

describe('DashboardUserStats', () => {
  const genUser = n => ({
    _id: n,
    status: 'online',
    profile: {
      firstName: `John ${n}`,
      lastName: `Doe ${n}`,
    },
  });
  it('renders collapse when more than 5 users online', () => {
    const len = 25;
    const users = times(genUser, len);
    const usersPerRow = 5;
    const wrapper = mount(<DashboardUserStats {...{ users, usersPerRow }} />);
    expect(wrapper.find(Collapse)).toHaveLength(1);
    expect(wrapper.find(DashboardStatsUserList)).toHaveLength(len / usersPerRow);
  });

  it('does not render collapse when less than 5 users online', () => {
    const users = times(genUser, 4);
    const usersPerRow = 5;
    const wrapper = mount(<DashboardUserStats {...{ users, usersPerRow }} />);
    expect(wrapper.find(Collapse)).toHaveLength(0);
    expect(wrapper.find(DashboardStatsUserList)).toHaveLength(1);
  });

  it('matches snapshot', () => {
    const users = times(genUser, 25);
    const usersPerRow = 5;
    const wrapper = mount(<DashboardUserStats {...{ users, usersPerRow }} />);
    expect(wrapper).toMatchSnapshot();
  });
});
