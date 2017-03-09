import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { HTTP } from 'meteor/http';
import { EmailsForPlioReporting } from '/imports/share/constants';

let prewIsCrashed = true;

const BACKGROUND_APP_URL = Meteor.settings.backgroundApp.url;
const CRASHED_MESSAGE = 'Background application was crashed with error:';
const RUNNING_MESSAGE = 'Background application is working now';

SyncedCron.add({
  name: 'Check alive background application',

  schedule(parser) {
    return parser.text('every 1 hour');
  },

  job() {
    HTTP.call('GET', BACKGROUND_APP_URL, (err, response) => {
      const isCrashed = Boolean(err || response && response.statusCode !== 200);

      if (prewIsCrashed === isCrashed) return;

      prewIsCrashed = isCrashed;

      Email.send({
        subject: `Background application status: ${isCrashed ? 'CRASHED' : 'RUNNING'}`,
        from: 'noreply@pliohub.com',
        to: EmailsForPlioReporting,
        text: isCrashed
          ? [CRASHED_MESSAGE, err].join(' ')
          : RUNNING_MESSAGE,
      });
    });
  },
});
