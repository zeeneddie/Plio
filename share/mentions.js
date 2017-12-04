import { Meteor } from 'meteor/meteor';

export const MENTION_REGEX = /\B@[a-z0-9_-]+$/gi;

export const MENTION_EMAIL_REGEX = /(\B@[a-z0-9_-]+ \(\S+@\S+\.\S+\))/gi;

export const getMentionData = (text) => {
  const splitted = text.split(MENTION_EMAIL_REGEX);
  const data = splitted.filter(Boolean).map((str) => {
    const mentionExecRegexSource = MENTION_EMAIL_REGEX.source
      .substring(1, MENTION_EMAIL_REGEX.source.length - 1)
      .split(' ')
      .map(r => `(${r})`)
      .join(' ');
    const mentionExecRegex = new RegExp(mentionExecRegexSource, 'gi');
    const match = mentionExecRegex.exec(str);

    if (!match) return { mentionString: str, text };

    const match2 = match[2];
    const firstName = match[1];
    const email = match2 && match2.substring(1, match2.length - 1);

    return {
      firstName, email, match, text, mentionString: str,
    };
  });

  return data;
};

export const getMentionDataWithUsers = (data = []) => {
  const newData = data.map(({ email, ...props }) => ({
    ...props,
    email,
    user: Meteor.users.findOne({ 'emails.address': email }),
  }));

  return newData;
};

export const removeEmails = (text) => {
  const data = getMentionData(text);
  const reducer = (prev, { match, firstName, mentionString }) => {
    if (!match) return prev.concat(mentionString);

    return prev.concat(firstName);
  };
  const textArray = Object.assign([], data).reduce(reducer, []);

  return textArray.join('');
};
