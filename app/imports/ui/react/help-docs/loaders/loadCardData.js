import { DocumentCardSubs } from '/imports/startup/client/subsmanagers';
import { setIsCardReady } from '/client/redux/actions/globalActions';

export default ({ urlItemId, dispatch }, onData) => {
  let sub;
  let isCardReady = true;

  if (urlItemId) {
    sub = DocumentCardSubs.subscribe('helpCard', urlItemId);
    isCardReady = sub.ready();
  }

  dispatch(setIsCardReady(isCardReady));

  onData(null, {});
};
