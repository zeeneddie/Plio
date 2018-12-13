import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import moment from 'moment';

import createContext from '../../../share/utils/tests/createContext';
import { DEFAULT_ORG_TIMEZONE, CollectionNames } from '../../../share/constants';
import NotificationSender from '../../../share/utils/NotificationSender';

jest.mock('../../../share/utils/NotificationSender');

describe('sendDailyRecap custom configs', () => {
  let context;
  const timezone = DEFAULT_ORG_TIMEZONE;
  const description = 'Hello World';

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});

    const config = ({ organization: { serialNumber } }) => ({
      collection: context.collections.Organizations,
      collectionName: CollectionNames.ORGANIZATIONS,
      description,
      getDocConfig: ({ name }) => ({ title: name, url: serialNumber }),
    });

    Meteor.users = context.collections.Users;
    jest.doMock('../../../share/collections', () => context.collections);
    jest.doMock('../configs', () => [config]);
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  it('supports custom configs', async () => {
    const { sendDailyRecap } = require('../sendDailyRecap');
    const organizationName = faker.random.word();
    const serialNumber = faker.random.number();

    const organizationId = await context.collections.Organizations.insert({
      timezone,
      serialNumber,
      name: organizationName,
    });
    await context.collections.AuditLogs.insert({
      organizationId,
      date: moment().subtract(1, 'day').toDate(),
      executor: context.userId,
      collection: CollectionNames.ORGANIZATIONS,
      documentId: organizationId,
      message: faker.random.word(),
    });

    await sendDailyRecap(organizationId);
    expect(NotificationSender.mock.calls[0][0].templateData.recapData[0]).toEqual({
      title: `1 ${description} was updated:`,
      data: [
        {
          title: organizationName,
          url: serialNumber,
          logs: expect.any(Array),
        },
      ],
    });
  });
});
