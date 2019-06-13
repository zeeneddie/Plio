import moment from 'moment-timezone';
import pluralize from 'pluralize';
import { Meteor } from 'meteor/meteor';
import {
  groupBy,
  prop,
  propOr,
  pluck,
  sort,
  descend,
  compose,
  filter,
  reject,
  isNil,
} from 'ramda';
import invariant from 'invariant';

import { CollectionNames } from '../../share/constants';
import { AuditLogs, Organizations } from '../../share/collections';
import { getPrettyTzDate } from '../../helpers/date';
import { getAbsoluteUrl } from '../../helpers/url';
import NotificationSender from '../../share/utils/NotificationSender';
import { getUserFullNameOrEmail } from '../../share/helpers';
import configs from './configs';

const RECAP_EMAIL_TEMPLATE = 'recapEmail';

const collections = [
  CollectionNames.STANDARDS,
  CollectionNames.NCS,
  CollectionNames.RISKS,
  CollectionNames.ACTIONS,
  CollectionNames.ORGANIZATIONS,
  CollectionNames.KEY_PARTNERS,
  CollectionNames.KEY_ACTIVITIES,
  CollectionNames.KEY_RESOURCES,
  CollectionNames.VALUE_PROPOSITIONS,
  CollectionNames.CUSTOMER_RELATIONSHIPS,
  CollectionNames.CHANNELS,
  CollectionNames.CUSTOMER_SEGMENTS,
  CollectionNames.COST_LINES,
  CollectionNames.REVENUE_STREAMS,
  CollectionNames.GOALS,
  CollectionNames.MILESTONES,
  CollectionNames.BENEFITS,
  CollectionNames.FEATURES,
  CollectionNames.NEEDS,
  CollectionNames.WANTS,
];

const sortByTitle = sort(descend(prop('title')));
const groupByCollection = groupBy(prop('collection'));
const groupByDocumentId = groupBy(prop('documentId'));

export const getRecapDate = (date, timezone) => {
  if (!date) {
    return moment().tz(timezone).subtract(1, 'day').toDate();
  }

  return moment.tz([
    date.getFullYear(), date.getMonth(), date.getDate(),
  ], timezone).toDate();
};

const getLogDates = (recapDate, timezone) => {
  const date = moment(recapDate).tz(timezone); // is this actually needed?
  const startDate = date.startOf('day').toDate();
  const endDate = date.endOf('day').toDate();

  return { startDate, endDate };
};

const getUserName = async (executor) => {
  const user = await Meteor.users.findOne({ _id: executor });
  const userName = getUserFullNameOrEmail(user);
  return userName;
};

const getRecipients = compose(
  pluck('userId'),
  filter(({ isRemoved, sendDailyRecap }) => !isRemoved && sendDailyRecap),
  propOr([], 'users'),
);

const prepare = async (organizationId, date) => {
  const organization = await Organizations.findOne({ _id: organizationId });

  invariant(organization, '[Daily recap]: Organization not found');

  const { timezone, serialNumber } = organization;
  const recapDate = getRecapDate(date, timezone);
  const unsubscribeUrl = getAbsoluteUrl(`${serialNumber}/unsubscribe`);
  const emailSubject = `Daily recap for ${getPrettyTzDate(recapDate, timezone)}`;
  const recipients = getRecipients(organization);
  const { startDate, endDate } = getLogDates(recapDate, timezone);

  return {
    organization,
    recapDate,
    unsubscribeUrl,
    emailSubject,
    recipients,
    startDate,
    endDate,
  };
};

const processLog = async (log, organization) => {
  const {
    documentId,
    collection,
    message,
    date,
    executor,
  } = log;
  const { timezone } = organization;
  const prettyDate = getPrettyTzDate(date, timezone, 'h:mm A');
  const userName = await getUserName(executor);

  return {
    documentId,
    message,
    collection,
    date: prettyDate,
    executor: userName,
  };
};

const processLogs = async ({ organization, startDate, endDate }) => {
  const { _id: organizationId } = organization;
  const query = {
    organizationId,
    collection: { $in: collections },
    date: {
      $gt: startDate,
      $lt: endDate,
    },
  };
  const options = { sort: { date: -1 } };
  const promises = await AuditLogs.find(query, options).map(log => processLog(log, organization));
  const logs = await Promise.all(promises);

  return logs;
};

const makeDocsData = async (args, config) => {
  const { logs: logsByCollection } = args;
  const {
    collection,
    collectionName,
    description,
    title: configTitle,
    getDocConfig,
  } = await config(args);
  const logs = logsByCollection[collectionName];

  if (!logs || !logs.length) return undefined;

  const logsById = groupByDocumentId(logs);
  const len = logsById && Object.keys(logsById).length;
  const ids = Object.keys(logsById);
  const query = { _id: { $in: ids } };
  let title = configTitle;

  if (typeof configTitle === 'function') {
    title = configTitle({ count: len, description });
  }

  if (!configTitle) {
    title = `${len} ${pluralize(description, len)} ${pluralize('was', len)} updated:`;
  }

  const promises = await collection.find(query).map(async (doc) => {
    const docLogs = logsById[doc._id];

    if (!getDocConfig) return { logs: docLogs };

    return {
      logs: docLogs,
      ...await getDocConfig(doc),
    };
  });
  const data = await Promise.all(promises).then(sortByTitle);

  return { title, data };
};

const makeRecapData = async (args, logs) => {
  const logsByCollection = groupByCollection(logs);

  const data = await Promise.all(
    configs.map(config => makeDocsData({ ...args, logs: logsByCollection }, config)),
  );

  return reject(isNil, data);
};

const sendEmails = async (args, data) => {
  if (!data || !data.length) return;

  // send with empty recipients?

  const {
    emailSubject,
    recipients,
    organization,
    unsubscribeUrl,
  } = args;

  const templateData = {
    organizationName: organization.name,
    title: emailSubject,
    unsubscribeUrl,
    recapData: data,
  };

  new NotificationSender({
    templateName: RECAP_EMAIL_TEMPLATE,
    recipients,
    emailSubject,
    templateData,
  }).sendEmail({ isReportEnabled: true });
};

export const sendDailyRecap = async (organizationId, date) => {
  const {
    organization,
    recipients,
    emailSubject,
    unsubscribeUrl,
    startDate,
    endDate,
  } = await prepare(organizationId, date);
  const logs = await processLogs({ startDate, endDate, organization });
  const data = await makeRecapData({ organization }, logs);
  await sendEmails({
    emailSubject,
    recipients,
    organization,
    unsubscribeUrl,
  }, data);
};
