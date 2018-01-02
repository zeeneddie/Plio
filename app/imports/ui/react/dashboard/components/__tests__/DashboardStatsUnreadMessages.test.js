import React from 'react';
import { mount } from 'enzyme';
import { times } from 'ramda';

import DashboardStatsUnreadMessages from '../DashboardStatsUnreadMessages';

describe('DashboardStatsUnreadMessages', () => {
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

    const wrapper = mount(<DashboardStatsUnreadMessages {...{ messages }} />);

    expect(wrapper.find('.dashboard-stats-message')).toHaveLength(len);
    expect(wrapper.find('.fa-file-docx-o')).toHaveLength(len / 2);
  });

  it('matches snapshot', () => {
    const messages = times(genMessage, 24);
    const wrapper = mount(<DashboardStatsUnreadMessages {...{ messages }} />);

    expect(wrapper).toMatchSnapshot();
  });
});
