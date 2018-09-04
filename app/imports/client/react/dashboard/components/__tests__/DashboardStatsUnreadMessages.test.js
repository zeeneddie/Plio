import React from 'react';
import { mount } from 'enzyme';
import { times } from 'ramda';

import { DashboardStatsUnreadMessages } from '../DashboardStatsUnreadMessages';

describe('DashboardStatsUnreadMessages', () => {
  const realDate = Date;

  beforeEach(() => {
    global.Date = jest.fn();
    global.Date.now = jest.fn();
  });

  afterAll(() => {
    global.Date = realDate;
  });

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
    const len = 24;
    const messages = times(genMessage, len);

    const wrapper = mount(<DashboardStatsUnreadMessages
      displayMessages={1}
      isOpen={false}
      toggle={jest.fn()}
      {...{
        messages,
        markAllAsRead,
        loadAll,
        loadLimited,
        orgSerialNumber,
        count: len,
      }}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
