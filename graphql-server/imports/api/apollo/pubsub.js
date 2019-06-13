/* eslint-disable import/no-mutable-exports */
import { PubSub } from 'graphql-subscriptions';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { Meteor } from 'meteor/meteor';

let pubsub;

if (process.env.NODE_ENV === 'production') {
  const { settings: { redis: { host, port } } } = Meteor;
  const CONNECT_TIMEOUT = 10000;
  const options = {
    host,
    port,
    connectTimeout: CONNECT_TIMEOUT,
    retry_strategy: opts => Math.max(opts.attempt * 100, 3000),
  };

  pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options),
  });
} else {
  pubsub = new PubSub();
}

export default pubsub;
