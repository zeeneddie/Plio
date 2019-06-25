/* globals meteorInstall: false */

import vm from 'vm';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { MongoInternals, Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email';

// DO NOT TOUCH BY ANY MEANS
if (process.env.NODE_ENV !== 'production') {
  const Emails = new Mongo.Collection('stub/emails');

  Meteor.methods({
    'emails/stub': () => {
      Email.__send = Email.send;
      Email.send = async options => Emails.insert(options);
    },
    'emails/restore': () => {
      Email.send = Email.__send;
    },
    'emails/reset': async () => Emails.remove({}),
    'emails/get': async (query, options) => {
      check(query, Match.Maybe(Object));
      check(options, Match.Maybe(Object));
      return Emails.find(query, options).fetch();
    },
    async clearDatabase() {
      const { db } = MongoInternals.defaultRemoteCollectionDriver().mongo;
      const collections = await db.collections();
      await Promise.all(collections.map(collection => collection.deleteMany({})));
    },
    async backdoor(func, ...args) {
      check(func, String);
      check(args, Match.Optional(Array));

      try {
        const preparedFunc = vm.runInThisContext(
          `(function (require) { return (${func}); })`,
        ).call(null, meteorInstall());
        return {
          value: await preparedFunc.call(global, ...args),
        };
      } catch (error) {
        return {
          error: {
            message: error.toString(),
            stack: error.stack ? error.stack.toString() : '',
            code: func,
          },
        };
      }
    },
  });
}
