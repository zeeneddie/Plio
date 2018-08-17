import { Meteor } from 'meteor/meteor';

export default {
  isIframeReady: false,
  onRendered() {
    Meteor.setTimeout(() => {
      this.isIframeReady(true);
    }, 1000);
  },
};
