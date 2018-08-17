import User from './User';
import Organization from './Organization';
import File from './File';
import Action from './Action';
import Risk from './Risk';
import Analysis from './Analysis';
import ImprovementPlan from './ImprovementPlan';
import Lesson from './Lesson';
import Goal from './Goal';
import Milestone from './Milestone';
import RiskType from './RiskType';
import Standard from './Standard';
import Department from './Department';

export default {
  ...User,
  ...Organization,
  ...File,
  ...Action,
  ...Risk,
  ...Analysis,
  ...ImprovementPlan,
  ...Lesson,
  ...Goal,
  ...Milestone,
  ...RiskType,
  ...Standard,
  ...Department,
};
