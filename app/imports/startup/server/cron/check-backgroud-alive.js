import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { PlioS3Logos } from '/imports/share/constants';
import NotificationSender from '/imports/share/utils/NotificationSender';

let prevIsCrashed = false;

const BACKGROUND_APP_URL = Meteor.settings.backgroundApp.url;
const CRASHED_MESSAGE = 'Background application crashed with';
const RUNNING_MESSAGE = 'Background application is up again';

SyncedCron.add({
  name: 'Check alive background application',

  schedule(parser) {
    return parser.text('30 minutes');
  },

  job() {
    HTTP.call('GET', BACKGROUND_APP_URL, (err, response) => {
      const isCrashed = Boolean(err || response && response.statusCode !== 200);

      if (prevIsCrashed === isCrashed) return;

      prevIsCrashed = isCrashed;
      const emailTitle = `Background application status: ${isCrashed ? 'CRASHED' : 'RUNNING'}`;
      const secondaryText = isCrashed
        ? [CRASHED_MESSAGE, err].join(' ')
        : RUNNING_MESSAGE;

      new NotificationSender({
        recipients: ['steve.ives@pliohub.com', 'mike@jssolutionsdev.com'],
        options: {
          isImportant: true,
        },
        emailSubject: emailTitle,
        templateData: {
          title: secondaryText,
          avatar: {
            alt: 'Plio',
            url: PlioS3Logos.square,
          },
        },
        templateName: 'personalEmail',
      }).sendEmail();
    });
  },
});
