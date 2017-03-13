import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { HTTP } from 'meteor/http';
import { EmailsForPlioReporting, PlioS3Logos } from '/imports/share/constants';
import NotificationSender from '/imports/share/utils/NotificationSender';

let prevIsCrashed = true;

const BACKGROUND_APP_URL = Meteor.settings.backgroundApp.url;
const CRASHED_MESSAGE = 'Background application was crashed with error:';
const RUNNING_MESSAGE = 'Background application is working now';

SyncedCron.add({
  name: 'Check alive background application',

  schedule(parser) {
    return parser.text('every 5 minutes');
  },

  job() {
    HTTP.call('GET', BACKGROUND_APP_URL, (err, response) => {
      const isCrashed = Boolean(err || response && response.statusCode !== 200);

      if (prevIsCrashed === isCrashed) return;

      prevIsCrashed = isCrashed;

      const ownerDetail = Meteor.users.findOne({ _id: this._orgOwnerId })
      const { firstName, lastName } = ownerDetail.profile;

      const emailTitle = `Background application status: ${isCrashed ? 'CRASHED' : 'RUNNING'}`;
      const secondaryText = isCrashed
        ? [CRASHED_MESSAGE, err].join(' ')
        : RUNNING_MESSAGE;

      new NotificationSender({
        recipients: EmailsForPlioReporting,
        emailSubject,
        templateData: {
          title: emailTitle,
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
