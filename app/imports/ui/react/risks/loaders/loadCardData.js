import { DocumentCardSubs } from '/imports/startup/client/subsmanagers';
import { setIsCardReady } from '/imports/client/store/actions/globalActions';
import { updateRisk } from '/imports/client/store/actions/collectionsActions';
import { getState } from '/imports/client/store';
import { Risks } from '/imports/share/collections/risks';

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
    const initializing = getState('risks.initializing');

    subscription = DocumentCardSubs.subscribe('riskCard', subArgs, {
      onReady() {
        // update standard in store when initializing
        // because observers are not running at that moment
        if (initializing) {
          const risk = Risks.findOne({ _id: urlItemId });

          if (risk) {
            dispatch(updateRisk(risk));
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
