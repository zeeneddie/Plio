/* eslint-disable no-proto */

import { mergeDeepRight, mapObjIndexed, is } from 'ramda';
import faker from 'faker';
import { Mongo } from 'meteor/mongo';
import sift from 'sift';

export default (ctx) => {
  const Collections = require('../../collections');
  const services = require('../../services');
  const collections = {
    ...mapObjIndexed((c, key) => new Mongo.Collection(key), Collections),
    Users: new Mongo.Collection('users'),
  };
  const loaders = {
    User: collections.Users,
    Organization: collections.Organizations,
    File: collections.Files,
    Risk: collections.Risks,
    Action: collections.Actions,
    Lesson: collections.LessonsLearned,
    Milestone: collections.Milestones,
    Goal: collections.Goals,
    RiskType: collections.RiskTypes,
    Standard: collections.Standards,
    Department: collections.Departments,
    ValueProposition: collections.ValuePropositions,
    CustomerSegment: collections.CustomerSegments,
    Benefit: collections.Benefits,
    Feature: collections.Features,
    Need: collections.Needs,
    Want: collections.Wants,
    Relation: collections.Relations,
  };

  Object.assign(collections.Organizations.__proto__, {
    addMembers(query, users) {
      const modifier = {
        $set: {
          users: users.map((user) => {
            if (is(Object, user)) {
              return { isRemoved: false, ...user };
            }

            return { userId: user, isRemoved: false };
          }),
        },
      };
      const options = { upsert: true, multi: true };

      return this.update(query, modifier, options);
    },
  });

  const context = mergeDeepRight({
    userId: faker.random.uuid(),
    collections,
    services,
    loaders: Object.keys(loaders).reduce((acc, key) => {
      const collection = loaders[key];

      return {
        ...acc,
        [key]: {
          byId: {
            load: jest.fn(_id => collection.findOne({ _id })),
            loadMany: jest.fn(ids => collection.find({ _id: { $in: ids } }).fetch()),
          },
          byQuery: {
            load: jest.fn(query => collection.find(query).fetch()),
            loadMany: jest.fn((queries) => {
              const docs = collection.find({ $or: queries }).fetch();
              return queries.map(query => sift(query, docs));
            }),
          },
        },
      };
    }, {}),
  }, ctx);

  return context;
};
