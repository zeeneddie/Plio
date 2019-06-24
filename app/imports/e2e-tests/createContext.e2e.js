/* eslint-disable no-shadow */

import { mergeDeepRight } from 'ramda';
import DDPClient from 'xolvio-ddp';

const Defaults = {
  users: [
    {
      email: 'hello@world.com',
      password: 'password',
      profile: {
        firstName: 'hello',
        lastName: 'world',
      },
    },
    {
      email: 'foo@bar.com',
      password: 'password',
      profile: {
        firstName: 'Foo',
        lastName: 'Bar',
      },
    },
  ],
};

export default (ctx) => {
  const state = {
    ddp: null,
    users: Defaults.users,
    userId: null,
  };

  const context = mergeDeepRight({
    get state() {
      return state;
    },
    connect: async () => {
      state.ddp = new DDPClient({
        url: `${process.env.ROOT_URL.replace('http', 'ws')}/websocket`,
        autoReconnect: false,
      });

      await new Promise((resolve, reject) => {
        state.ddp.connect((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    },
    execute: async (func, ...args) => {
      const result = await state.ddp.call('backdoor', func.toString(), ...args);

      if (result.error) {
        const error = new Error(`[Context.execute] error: ${result.error.message}`);
        error.stack += `\n${result.error.stack.replace(/ {4}at/g, '  @')}`;
        throw error;
      } else {
        return result.value;
      }
    },
    clearDB: async () => context.state.ddp.call('clearDatabase'),
    registerUsers: async (users = state.users) => {
      const userDocs = await Promise.all(users.map(async user => context.execute((user) => {
        const { Accounts } = require('meteor/accounts-base');
        const { Meteor } = require('meteor/meteor');

        Accounts.createUser(user);

        const userDoc = Meteor.users.findOne({ 'emails.address': user.email });
        if (!userDoc) throw new Error(`User ${user.email} not found`);
        return userDoc;
      }, user)));

      state.users = userDocs.map((user, index) => ({ ...state.users[index], _id: user._id }));
    },
    verifyEmails: async () => context.execute(async (users) => {
      const { Meteor } = require('meteor/meteor');
      const { pluck } = require('ramda');

      const query = { 'emails.address': { $in: pluck('email', users) } };
      const modifier = {
        $set: {
          'emails.$.verified': true,
        },
      };
      const options = { multi: true };
      return Meteor.users.update(query, modifier, options);
    }, state.users),
    login: async (user = state.users[0]) => page.evaluate(`
      new Promise((resolve, reject) => {
        Meteor.loginWithPassword('${user.email}', '${user.password}', (err, res) => {
          if (err) reject(err);
          else resolve(Meteor.user());
        });
      });
    `),
    createOrganization: async args => context.execute(async (args) => {
      const moment = require('moment-timezone');
      const { mergeDeepRight } = require('ramda');

      const {
        default: OrganizationService,
      } = require('/imports/api/organizations/organization-service');
      const {
        OrgCurrencies,
        HomeScreenTypes,
      } = require('/imports/share/constants');

      return OrganizationService.insert(mergeDeepRight({
        timezone: moment.tz.guess(),
        currency: OrgCurrencies.GBP,
        homeScreenType: HomeScreenTypes.OPERATIONS,
      }, args));
    }, args),
    createFixtures: async ({ user = context.state.users[1] } = {}) => {
      const {
        DEFAULT_TEMPLATE_ORGANIZATION_ID,
      } = require('../share/constants');
      const organizationId = await context.createOrganization({
        _id: DEFAULT_TEMPLATE_ORGANIZATION_ID,
        name: 'Template',
        ownerId: user._id,
      });
      await context.execute((organizationId) => {
        const { Organizations } = require('/imports/share/collections');
        const { CustomerTypes } = require('/imports/share/constants');
        Organizations.update({ _id: organizationId }, {
          $set: {
            customerType: CustomerTypes.TEMPLATE,
          },
        });
      }, organizationId);
    },
  }, ctx);

  return context;
};
