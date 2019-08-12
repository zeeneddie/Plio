import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  Mongo.setConnectionOptions({
    mongos: {
      socketOptions: {
        socketTimeoutMS: 360000,
        keepAlive: true,
        reconnectTries: Number.MAX_VALUE,
      },
    },
  });
});
