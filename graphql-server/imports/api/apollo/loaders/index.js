import { reduce } from 'ramda';

import User from './User';
import Organization from './Organization';
import File from './File';
import Risk from './Risk';
import Action from './Action';
import Lesson from './Lesson';
import Milestone from './Milestone';
import Goal from './Goal';

const loaders = {
  User,
  Organization,
  File,
  Risk,
  Action,
  Lesson,
  Milestone,
  Goal,
};

export const createLoaders = () => reduce(
  (parentAcc, parentKey) => ({
    ...parentAcc,
    [parentKey]: reduce((acc, key) => ({
      ...acc,
      [key]: loaders[parentKey][key](),
    }), {}, Object.keys(loaders[parentKey])),
  }),
  {},
  Object.keys(loaders),
);

export default loaders;
