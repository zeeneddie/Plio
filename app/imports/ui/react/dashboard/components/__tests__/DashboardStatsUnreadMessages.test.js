import React from 'react';
import { shallow } from 'enzyme';
import { times } from 'ramda';

import DashboardStatsUnreadMessages from '../DashboardStatsUnreadMessages';
import { DashboardStatsMessageContainer } from '../../containers';

describe('DashboardStatsUnreadMessages', () => {
  const realDate = Date;

  beforeEach(() => {
    global.Date = jest.fn();
  });
  afterEach(() => {
    global.Date = realDate;
  });

  const len = 24;
  const count = len;
  const markAllAsRead = jest.fn();
  const loadAll = jest.fn();
  const loadLimited = jest.fn();
  const orgSerialNumber = 1;
  const genMessage = n => ({
    _id: n,
    url: `http://example.com/${n}`,
    extension: n % 2 === 0 ? 'docx' : undefined,
    fullName: `John Doe ${n}`,
    text: `Hello World #${n}`,
    timeString: (new Date()).toString(),
  });
  it('renders messages correctly', () => {
    const messages = times(genMessage, len);

    const wrapper = shallow(<DashboardStatsUnreadMessages
      {...{
        messages,
        count,
        markAllAsRead,
        loadAll,
        loadLimited,
        orgSerialNumber,
      }}
    />);

    expect(wrapper.find(DashboardStatsMessageContainer)).toHaveLength(len);
  });

  it('matches snapshot', () => {
    const messages = times(genMessage, len);
    const wrapper = shallow(<DashboardStatsUnreadMessages
      {...{
        messages,
        count,
        markAllAsRead,
        loadAll,
        loadLimited,
        orgSerialNumber,
      }}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
