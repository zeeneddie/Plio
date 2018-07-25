import { HTTP } from 'meteor/http';
import { tmpdir } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';

import { PlioS3Logos, EmailsForPlioReporting } from '../../../share/constants';
import NotificationSender from '../../../share/utils/NotificationSender';

const isRequired = () => {
  throw new Error('Missing parameter');
};

export const checkServerStatusAndReport = ({
  tmpFileName = isRequired(),
  url = isRequired(),
  appName = isRequired(),
}) => {
  const prevStateFile = join(tmpdir(), tmpFileName);

  HTTP.call('GET', url, (err, res) => {
    const isCrashed = Boolean(err || res && res.statusCode !== 200);

    const prevIsCrashed = existsSync(prevStateFile)
      ? JSON.parse(readFileSync(prevStateFile))
      : !isCrashed;

    if (prevIsCrashed === isCrashed) return;

    writeFileSync(prevStateFile, JSON.stringify(isCrashed));

    const crashedMessage = `${appName} crashed with`;
    const runningMessage = `${appName} is up again`;
    const emailTitle = `${appName} status: ${isCrashed ? 'CRASHED' : 'RUNNING'}`;
    const secondaryText = isCrashed ? [crashedMessage, err].join(' ') : runningMessage;

    new NotificationSender({
      recipients: EmailsForPlioReporting,
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
};
