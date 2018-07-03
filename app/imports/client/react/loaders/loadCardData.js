import { setIsCardReady } from '/imports/client/store/actions/globalActions';

export default subscribe => function loadCardData({
  dispatch,
  urlItemId,
  ...props
}, onData) {
  let subscription;
  let isCardReady = true;

  if (urlItemId) {
    subscription = subscribe({ urlItemId, ...props });
    isCardReady = subscription.ready();
  }

  dispatch(setIsCardReady(isCardReady));
  onData(null, {});
};
