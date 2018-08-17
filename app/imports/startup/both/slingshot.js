import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { invert, map, compose, mergeDeepLeft } from 'ramda';

import { AWSDirectives } from '../../share/constants';

const getConfig = compose(
  mergeDeepLeft({
    [AWSDirectives.DISCUSSION_FILES]: {
      maxSize: Meteor.settings.public.discussionFilesMaxSize,
    },
    [AWSDirectives.USER_AVATARS]: {
      allowedFileTypes: ['image/png', 'image/jpeg', 'image/gif'],
      maxSize: Meteor.settings.public.userAvatarsMaxSize,
    },
    [AWSDirectives.HTML_ATTACHMENT_PREVIEW]: {
      allowedFileTypes: 'text/html',
    },
  }),
  map(() => ({
    allowedFileTypes: null,
    maxSize: Meteor.settings.public.otherFilesMaxSize,
  })),
  invert,
);

const config = getConfig(AWSDirectives);

Object.keys(config).forEach((key) => {
  Slingshot.fileRestrictions(key, config[key]);
});
