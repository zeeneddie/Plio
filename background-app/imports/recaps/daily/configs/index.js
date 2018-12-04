import Action from './Action';
import Channel from './Channel';
import CostLine from './CostLine';
import CustomerRelationship from './CustomerRelationship';
import CustomerSegment from './CustomerSegment';
import KeyActivity from './KeyActivity';
import KeyPartner from './KeyPartner';
import KeyResource from './KeyResource';
import Nonconformity from './Nonconformity';
import Organization from './Organization';
import RevenueStream from './RevenueStream';
import Risk from './Risk';
import Standard from './Standard';
import ValueProposition from './ValueProposition';
import Goal from './Goal';
import Milestone from './Milestone';
import Benefit from './Benefit';
import Feature from './Feature';
import Need from './Need';
import Want from './Want';

export default [
  Action,
  Channel,
  CostLine,
  CustomerRelationship,
  CustomerSegment,
  KeyActivity,
  KeyPartner,
  KeyResource,
  Nonconformity,
  RevenueStream,
  Risk,
  Standard,
  ValueProposition,
  Goal,
  Milestone,
  Benefit,
  Feature,
  Need,
  Want,
  // WARN: Organization should be ordered last always!!!
  Organization,
];
