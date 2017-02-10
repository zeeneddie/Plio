import { DocumentCardSubs } from '/imports/startup/client/subsmanagers';
import { setIsCardReady } from '/imports/client/store/actions/globalActions';
import { updateStandard } from '/imports/client/store/actions/collectionsActions';
import { getState } from '/imports/client/store';
import { Standards } from '/imports/share/collections/standards';

export default function loadCardData({
  dispatch,
  organizationId,
  urlItemId,
}, onData) {
  let subscription;
  let isCardReady = true;

  if (urlItemId) {
    const subArgs = { organizationId, _id: urlItemId };
    // get initializing state before subscription ready because it will be false always otherwise
    const initializing = getState('standards.initializing');

    subscription = DocumentCardSubs.subscribe('standardCard', subArgs, {
      onReady() {
        // update standard in store when initializing
        // because observers are not running at that moment
        if (initializing) {
          const standard = Standards.findOne({ _id: urlItemId });

          if (standard) {
            dispatch(updateStandard(standard));
          }
        }
      },
    });

    isCardReady = subscription.ready();
  }

  dispatch(setIsCardReady(isCardReady));

  onData(null, {});

  return () => typeof subscription === 'function' && subscription.stop();
}
