import 'raf/polyfill';
import 'jest-enzyme';
import 'jest-styled-components';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mergeDeepRight } from 'ramda';
import fetch from 'unfetch';
import { Meteor } from 'meteor/meteor';

Object.assign(global, {
  fetch,
  WebSocket: jest.fn(),
});

jest.setTimeout(30000);

Meteor.settings = mergeDeepRight(Meteor.settings, {
  public: {
    graphql: {
      url: '',
    },
  },
  mainApp: {
    url: '',
  },
});

configure({ adapter: new Adapter() });
