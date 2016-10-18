import { Meteor } from 'meteor/meteor';

export default {
    iframe: {
        isIframeReady: false,
        onRendered() {
            Meteor.setTimeout(() => {
                this.isIframeReady(true);
            }, 300);
        }
    }
}