import { DocumentCardSubs } from '/imports/startup/client/subsmanagers';
import { setIsHelpCardReady } from '/client/redux/actions/helpDocsActions';

export default ({ urlItemId, dispatch }, onData) => {
  let sub;
  let isCardReady = true;

  if (urlItemId) {
    sub = DocumentCardSubs.subscribe('helpCard', urlItemId);
    isCardReady = sub.ready();
  }

  dispatch(setIsHelpCardReady(isCardReady));

  onData(null, {});
};
