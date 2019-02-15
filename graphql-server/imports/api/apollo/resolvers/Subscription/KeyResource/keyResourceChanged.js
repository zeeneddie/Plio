import { Subscriptions } from '../../../../../share/subscriptions/constants';
import resolveEntityChanged from '../util/resolveEntityChanged';

export default {
  subscribe: resolveEntityChanged(Subscriptions.KEY_RESOURCE_CHANGED),
};
