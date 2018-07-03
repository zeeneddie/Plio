import React from 'react';
import { mount, shallow } from 'enzyme';
import { times } from 'ramda';

import { DashboardUserStats } from '../DashboardUserStats';
import DashboardStatsUserList from '../DashboardStatsUserList';
import { Collapse, PlusButton } from '../../../components';
import __modal__ from '../../../../../startup/client/mixins/modal';

jest.mock('../../../../../startup/client/mixins/modal', () => ({
  modal: {
    open: jest.fn(),
  },
}));

describe('DashboardUserStats', () => {
  const genUser = n => ({
    _id: n,
    status: 'online',
    profile: {
      firstName: `John ${n}`,
      lastName: `Doe ${n}`,
    },
  });
  const genUsers = times(genUser);

  it('renders collapse when more than 5 users online', () => {
    const len = 25;
    const users = genUsers(len);
    const usersPerRow = 5;
    const onInvite = jest.fn();
    const wrapper = mount(<DashboardUserStats {...{ users, usersPerRow, onInvite }} />);
    expect(wrapper.find(Collapse)).toHaveLength(1);
    expect(wrapper.find(DashboardStatsUserList)).toHaveLength(len / usersPerRow);
  });

  it('does not render collapse when less than 5 users online', () => {
    const users = genUsers(4);
    const usersPerRow = 5;
    const onInvite = jest.fn();
    const wrapper = mount(<DashboardUserStats {...{ users, usersPerRow, onInvite }} />);
    expect(wrapper.find(Collapse)).toHaveLength(0);
    expect(wrapper.find(DashboardStatsUserList)).toHaveLength(1);
  });

  it('opens user invite modal', () => {
    const users = genUsers(2);
    const usersPerRow = 5;
    const onInvite = () => __modal__.modal.open();
    const wrapper = shallow(
      <DashboardUserStats
        canInviteUsers
        {...{ users, usersPerRow, onInvite }}
      />,
    );

    expect(wrapper.find(PlusButton)).toHaveLength(1);
    wrapper.find(PlusButton).simulate('click');
    expect(__modal__.modal.open).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const users = genUsers(25);
    const usersPerRow = 5;
    const onInvite = jest.fn();
    const wrapper = shallow(
      <DashboardUserStats
        canInviteUsers
        {...{
          users,
          usersPerRow,
          onInvite,
        }}
      />,
    );
    expect(wrapper).toMatchSnapshot();
  });
});
