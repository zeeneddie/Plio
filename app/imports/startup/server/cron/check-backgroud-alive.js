import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { tmpdir } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { PlioS3Logos } from '/imports/share/constants';
import NotificationSender from '/imports/share/utils/NotificationSender';


const BACKGROUND_APP_URL = Meteor.settings.backgroundApp.url;
const CRASHED_MESSAGE = 'Background application crashed with';
const RUNNING_MESSAGE = 'Background application is up again';

SyncedCron.add({
  name: 'Check alive background application',

  schedule(parser) {
    return parser.text('every 30 minutes');
  },

  job() {
    const prevStateFile = join(tmpdir(), 'background_prev_is_crashed');

    HTTP.call('GET', BACKGROUND_APP_URL, (err, response) => {
      const isCrashed = Boolean(err || response && response.statusCode !== 200);

      const prevIsCrashed = existsSync(prevStateFile)
        ? JSON.parse(readFileSync(prevStateFile))
        : !isCrashed;

      if (prevIsCrashed === isCrashed) return;

      writeFileSync(prevStateFile, JSON.stringify(isCrashed));

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
