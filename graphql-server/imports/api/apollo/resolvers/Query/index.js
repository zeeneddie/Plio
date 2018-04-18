import User from './User';
import Goal from './Goal';
import Organization from './Organization';
import RiskType from './RiskType';
import Risk from './Risk';
import Standard from './Standard';
import Department from './Department';
import Action from './Action';
import Milestone from './Milestone';

export default {
  ...User,
  ...Goal,
  ...Organization,
  ...RiskType,
  ...Risk,
  ...Standard,
  ...Department,
  ...Action,
  ...Milestone,
};
