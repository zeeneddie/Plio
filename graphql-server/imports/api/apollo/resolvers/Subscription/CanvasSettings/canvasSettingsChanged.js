import { Subscriptions } from '../../../constants';
import resolveEntityChanged from '../util/resolveEntityChanged';

export default {
  subscribe: resolveEntityChanged(Subscriptions.CANVAS_SETTINGS_CHANGED),
};
