import { Subscriptions } from '../../../constants';
import resolveEntityChanged from '../util/resolveEntityChanged';

export default {
  subscribe: resolveEntityChanged(Subscriptions.REVENUE_STREAM_CHANGED),
};
