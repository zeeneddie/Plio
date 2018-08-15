import { reduce } from 'ramda';

import User from './User';
import Organization from './Organization';
import File from './File';
import Risk from './Risk';
import Action from './Action';
import Lesson from './Lesson';
import Milestone from './Milestone';
import Goal from './Goal';
import RiskType from './RiskType';
import Standard from './Standard';
import Department from './Department';
import ValueProposition from './ValueProposition';
import CustomerSegment from './CustomerSegment';

const loaders = {
  User,
  Organization,
  File,
  Risk,
  Action,
  Lesson,
  Milestone,
  Goal,
  RiskType,
  Standard,
  Department,
  ValueProposition,
  CustomerSegment,
};

export const createLoaders = (ctx) => {
  const _loaders = reduce(
    (parentAcc, parentKey) => ({
      ...parentAcc,
      [parentKey]: reduce((acc, key) => ({
        ...acc,
        [key]: loaders[parentKey][key](ctx, () => _loaders),
      }), {}, Object.keys(loaders[parentKey])),
    }),
    {},
    Object.keys(loaders),
  );

  return _loaders;
};

export default loaders;
