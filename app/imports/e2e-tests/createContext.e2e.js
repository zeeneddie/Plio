import { mergeDeepRight } from 'ramda';
import DDPClient from 'xolvio-ddp';

const Defaults = {
  users: [
    {
      email: 'hello@world1234sad.com',
      password: 'password',
      profile: {
        firstName: 'hello',
        lastName: 'world',
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
        url: 'ws://localhost:1337/websocket',
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
      const userDocs = await Promise.all(users.map(async user => context.execute((usr) => {
        const { Accounts } = require('meteor/accounts-base');
        const { Meteor } = require('meteor/meteor');

        Accounts.createUser(usr);

        const userDoc = Meteor.users.findOne({ 'emails.address': usr.email });
        if (!userDoc) throw new Error(`User ${usr.email} not found`);
        return userDoc;
      }, user)));

      state.users = userDocs.map((user, index) => ({ ...state.users[index], _id: user._id }));
    },
    login: async (user = state.users[0]) => page.evaluate(`
      new Promise((resolve, reject) => {
        Meteor.loginWithPassword('${user.email}', '${user.password}', (err, res) => {
          if (err) reject(err);
          else resolve(Meteor.user());
        });
      });
    `),
  }, ctx);

  return context;
};
