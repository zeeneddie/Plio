import { Subscriptions } from '../../../constants';
import resolveEntityChanged from '../util/resolveEntityChanged';

export default {
  subscribe: resolveEntityChanged(Subscriptions.KEY_ACTIVITY_CHANGED),
};
