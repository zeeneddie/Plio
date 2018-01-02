import React from 'react';
import { shallow } from 'enzyme';
import { times } from 'ramda';

import DashboardStatsUnreadMessages from '../DashboardStatsUnreadMessages';
import { DashboardStatsMessageContainer } from '../../containers';
import { Button } from '../../../components';

describe('DashboardStatsUnreadMessages', () => {
  const realDate = Date;

  beforeEach(() => {
    global.Date = jest.fn();
  });
  afterEach(() => {
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
  it('renders messages correctly & does not render show/hide button', () => {
    const len = 24;
    const messages = times(genMessage, len);

    const wrapper = shallow(<DashboardStatsUnreadMessages
      {...{
        messages,
        markAllAsRead,
        loadAll,
        loadLimited,
        orgSerialNumber,
        count: len,
      }}
    />);

    expect(wrapper.find(DashboardStatsMessageContainer)).toHaveLength(len);
  });

  // eslint-disable-next-line max-len
  it('renders hide/show button only if total count of unread messages is greater than current', () => {
    const getProps = len => ({
      count: 24,
      markAllAsRead,
      loadAll,
      loadLimited,
      orgSerialNumber,
      isLimitEnabled: true,
      messages: times(genMessage, len),
    });

    const wrapper1 = shallow(<DashboardStatsUnreadMessages {...getProps(24)} />);
    const wrapper2 = shallow(<DashboardStatsUnreadMessages {...getProps(15)} />);

    expect(wrapper1.find(Button)).toHaveLength(0);
    expect(wrapper2.find(Button)).toHaveLength(1);
  });

  it('matches snapshot', () => {
    const len = 24;
    const messages = times(genMessage, len);
    const wrapper = shallow(<DashboardStatsUnreadMessages
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
