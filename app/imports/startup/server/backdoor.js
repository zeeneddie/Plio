/* globals meteorInstall: false */

import vm from 'vm';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { MongoInternals } from 'meteor/mongo';

// DO NOT TOUCH BY ANY MEANS
if (process.env.NODE_ENV !== 'production') {
  Meteor.methods({
    clearDatabase() {
      const { db } = MongoInternals.defaultRemoteCollectionDriver().mongo;
      const getCollections = Meteor.wrapAsync(db.collections, db);
      const collections = getCollections();
      collections.forEach((collection) => {
        const remove = Meteor.wrapAsync(collection.remove, collection);
        remove({}, {});
      });
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
