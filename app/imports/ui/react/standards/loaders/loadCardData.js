import { DocumentCardSubs } from '/imports/startup/client/subsmanagers';
import { setIsCardReady } from '/client/redux/actions/globalActions';
import { updateStandard } from '/client/redux/actions/collectionsActions';
import { getState } from '/client/redux/store';
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
