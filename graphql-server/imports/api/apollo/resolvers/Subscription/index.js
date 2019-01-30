import KeyPartner from './KeyPartner';
import KeyActivity from './KeyActivity';
import KeyResource from './KeyResource';
import ValueProposition from './ValueProposition';
import CustomerRelationship from './CustomerRelationship';
import Channel from './Channel';
import CustomerSegment from './CustomerSegment';
import CostLine from './CostLine';
import RevenueStream from './RevenueStream';
import CanvasSettings from './CanvasSettings';

export default {
  ...KeyPartner,
  ...KeyActivity,
  ...KeyResource,
  ...ValueProposition,
  ...CustomerRelationship,
  ...Channel,
  ...CustomerSegment,
  ...CostLine,
  ...RevenueStream,
  ...CanvasSettings,
};
