import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import moment from 'moment';
import { times, flatten } from 'ramda';

import createContext from '../../../share/utils/tests/createContext';
import { DEFAULT_ORG_TIMEZONE, CollectionNames } from '../../../share/constants';
import NotificationSender from '../../../share/utils/NotificationSender';
import { getPrettyTzDate } from '../../../helpers/date';

jest.mock('../../../share/utils/NotificationSender');

describe('sendDailyRecap', () => {
  faker.seed(123);

  let context;
  const timezone = DEFAULT_ORG_TIMEZONE;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});

    Meteor.users = context.collections.Users;
    jest.doMock('../../../share/collections', () => context.collections);
  });
  afterAll(__closeDB);
  beforeEach(async () => {
    await __clearDB();

    NotificationSender.mockClear();
    context.collections.Users.findOne.mockClear();
  });

  it('should default to yesterday if no date provided', async () => {
    const { sendDailyRecap } = require('../sendDailyRecap');

    const date = moment().subtract(1, 'day').toDate();
    const organizationId = await context.collections.Organizations.insert({
      timezone,
    });

    await Promise.all([
      context.collections.AuditLogs.insert({
        organizationId,
        date,
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.word(),
      }),
      context.collections.AuditLogs.insert({
        organizationId,
        date: moment().add(1, 'day').toDate(),
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.word(),
      }),
      context.collections.AuditLogs.insert({
        organizationId,
        date: moment().subtract(2, 'days').toDate(),
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.word(),
      }),
    ]);

    await sendDailyRecap(organizationId);

    const expectedDate = getPrettyTzDate(date, timezone, 'h:mm A');

    expect(NotificationSender.mock.calls[0][0].templateData.recapData[0].data).toHaveLength(1);
    expect(NotificationSender.mock.calls[0][0].templateData.recapData[0].data[0].logs[0].date)
      .toBe(expectedDate);
  });

  it('should use provided date for daily recap', async () => {
    const { sendDailyRecap } = require('../sendDailyRecap');

    const date = new Date(2018, 0, 1);
    const organizationId = await context.collections.Organizations.insert({
      timezone,
    });

    await Promise.all([
      context.collections.AuditLogs.insert({
        organizationId,
        date,
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.word(),
      }),
      context.collections.AuditLogs.insert({
        organizationId,
        date: moment(date).add(1, 'day').toDate(),
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.word(),
      }),
      context.collections.AuditLogs.insert({
        organizationId,
        date: moment(date).subtract(2, 'days').toDate(),
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.word(),
      }),
    ]);

    await sendDailyRecap(organizationId, date);

    const expectedDate = getPrettyTzDate(date, timezone, 'h:mm A');

    expect(NotificationSender.mock.calls[0][0].templateData.recapData[0].data[0].logs[0].date)
      .toBe(expectedDate);
  });

  it('ensures proper recipients', async () => {
    const { sendDailyRecap } = require('../sendDailyRecap');

    const date = moment().subtract(1, 'day').toDate();
    const [, ...recipientIds] = await Promise.all([
      context.collections.Users.insert({}),
      context.collections.Users.insert({ _id: context.userId }),
      context.collections.Users.insert({}),
      context.collections.Users.insert({}),
    ]);
    const users = recipientIds.map((userId, i) => ({
      userId,
      sendDailyRecap: i !== 1,
      isRemoved: i === 2,
    }));
    const organizationId = faker.random.uuid();
    await context.collections.Organizations.addMembers({ _id: organizationId, timezone }, users);

    await context.collections.AuditLogs.insert({
      organizationId,
      date,
      executor: context.userId,
      collection: CollectionNames.ORGANIZATIONS,
      documentId: organizationId,
      message: faker.random.word(),
    });

    await sendDailyRecap(organizationId);

    expect(NotificationSender.mock.calls[0][0].recipients).toEqual([context.userId]);
  });

  it('queries logs over the past 24hrs', async () => {
    const { sendDailyRecap } = require('../sendDailyRecap');

    const organizationId = await context.collections.Organizations.insert({ timezone });
    await Promise.all([
      ...times(n => context.collections.AuditLogs.insert({
        organizationId,
        date: moment()
          .tz(timezone)
          .subtract(1, 'day')
          .startOf('day')
          .add(n + 1, 'hours')
          .toDate(),
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.words(),
      }), 24),
      context.collections.AuditLogs.insert({
        organizationId,
        date: moment().subtract(10, 'days').toDate(),
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.words(),
      }),
      context.collections.AuditLogs.insert({
        organizationId,
        date: moment().add(10, 'days').toDate(),
        executor: context.userId,
        collection: CollectionNames.ORGANIZATIONS,
        documentId: organizationId,
        message: faker.random.words(),
      }),
    ]);

    await sendDailyRecap(organizationId);

    expect(NotificationSender.mock.calls[0][0].templateData.recapData[0].data[0].logs)
      .toHaveLength(23);
  });

  it('shouldn\t send emails when there are no data', async () => {
    const { sendDailyRecap } = require('../sendDailyRecap');

    const promise = sendDailyRecap(faker.random.uuid());

    await expect(promise).rejects.toEqual(expect.any(Error));
    expect(NotificationSender).not.toHaveBeenCalled();

    const organizationId = faker.random.uuid();
    await context.collections.Organizations.addMembers(
      { _id: organizationId, timezone },
      [
        { userId: context.userId, sendDailyRecap: true },
      ],
    );

    await sendDailyRecap(organizationId);

    expect(NotificationSender).not.toHaveBeenCalled();
  });

  it('properly counts documents', async () => {
    const { sendDailyRecap } = require('../sendDailyRecap');

    const organizationId = await context.collections.Organizations.insert({
      timezone,
      serialNumber: faker.random.number(),
    });
    const [keyPartnerId, ...keyActivityIds] = await Promise.all([
      context.collections.KeyPartners.insert({ organizationId }),
      ...times(() => context.collections.KeyActivities.insert({ organizationId }), 3),
    ]);
    await Promise.all([
      ...times(() => [
        context.collections.AuditLogs.insert({
          organizationId,
          date: moment().subtract(1, 'day').toDate(),
          executor: context.userId,
          collection: CollectionNames.KEY_PARTNERS,
          documentId: keyPartnerId,
          message: faker.random.words(),
        }),
      ], 3),
      ...keyActivityIds.map(id => times(() => context.collections.AuditLogs.insert({
        organizationId,
        date: moment().subtract(1, 'day').toDate(),
        executor: context.userId,
        collection: CollectionNames.KEY_ACTIVITIES,
        documentId: id,
        message: faker.random.word(),
      }), 3)),
    ]);

    await sendDailyRecap(organizationId);

    const data = NotificationSender.mock.calls[0][0].templateData.recapData;

    expect(data[0].title).toEqual(expect.stringMatching(/3 .+ were updated(.+)?:/));

    expect(data[1].title).toEqual(expect.stringMatching(/1 .+ was updated(.+)?:/));
  });

  it('matches snapshot', async () => {
    const { sendDailyRecap, getRecapDate } = require('../sendDailyRecap');

    const {
      Channels,
      CostLines,
      CustomerRelationships,
      CustomerSegments,
      KeyActivities,
      KeyPartners,
      KeyResources,
      RevenueStreams,
      ValuePropositions,
      Actions,
      NonConformities,
      Risks,
      Standards,
      Goals,
      Milestones,
      Benefits,
      Features,
      Needs,
      Wants,
    } = context.collections;

    const date = moment('2018-01-01').add(5, 'hours').toDate();
    const organizationName = faker.random.word();
    const subject = `Daily recap for ${getPrettyTzDate(getRecapDate(date, timezone), timezone)}`;

    await context.collections.Users.insert({ _id: context.userId });
    const organizationId = await context.collections.Organizations.insert({
      timezone,
      name: organizationName,
      serialNumber: faker.random.number(),
    });
    await context.collections.Organizations.addMembers(
      { _id: organizationId },
      [{ userId: context.userId, sendDailyRecap: true }],
    );

    const collections = [
      Channels,
      CostLines,
      CustomerRelationships,
      CustomerSegments,
      KeyActivities,
      KeyPartners,
      KeyResources,
      RevenueStreams,
      ValuePropositions,
      Actions,
      NonConformities,
      Risks,
      Standards,
      Goals,
      Milestones,
      Benefits,
      Features,
      Needs,
      Wants,
    ];

    await context.collections.AuditLogs.insert({
      organizationId,
      date,
      executor: context.userId,
      collection: CollectionNames.ORGANIZATIONS,
      documentId: organizationId,
      message: faker.random.word(),
    });

    const ids = await Promise.all(
      collections.map(collection => collection.insert({
        title: faker.random.word(),
        sequentialId: faker.random.word(),
        serialNumber: faker.random.number(),
      })),
    );
    await Promise.all([
      ...flatten(times(() => ids.map((id, i) => context.collections.AuditLogs.insert({
        organizationId,
        date,
        executor: context.userId,
        collection: collections[i].collection.collectionName,
        documentId: id,
        message: faker.random.words(),
        field: faker.random.word(),
        newValue: faker.random.word(),
        oldValue: faker.random.word(),
      })), 2)),
      context.collections.WorkItems.insert({
        linkedDoc: {
          _id: (await context.collections.Actions.findOne({}))._id,
        },
      }),
    ]);

    await sendDailyRecap(organizationId, date);

    expect(NotificationSender).toHaveBeenCalledWith({
      templateName: 'recapEmail',
      recipients: [context.userId],
      emailSubject: subject,
      templateData: {
        organizationName,
        title: subject,
        unsubscribeUrl: expect.stringMatching('/unsubscribe'),
        recapData: expect.any(Array),
      },
    });

    expect(NotificationSender.mock.calls[0][0]).toMatchSnapshot();
  });
});
