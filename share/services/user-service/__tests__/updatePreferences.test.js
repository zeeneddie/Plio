import { __setupDB, __closeDB, __clearDB } from 'meteor/mongo';
import faker from 'faker';
import { omit } from 'ramda';

import createContext from '../../../utils/tests/createContext';
import updatePreferences from '../updatePreferences';
import { CanvasColors } from '../../../constants';

describe('UserService.updatePreferences', () => {
  let context;

  beforeAll(async () => {
    await __setupDB();

    context = createContext({});
  });
  afterAll(__closeDB);
  beforeEach(__clearDB);

  it('updates user preferences', async () => {
    const args = {
      areNotificationsEnabled: true,
      notificationSound: '/sounds/sound',
      defaultCanvasColor: CanvasColors.YELLOW,
      a: faker.random.word(),
      b: faker.random.number(),
    };

    await context.collections.Users.insert({
      _id: context.userId,
      preferences: {
        areNotificationsEnabled: false,
        areEmailNotificationsEnabled: false,
      },
    });

    await updatePreferences(args, context);

    const user = await context.collections.Users.findOne({ _id: context.userId });

    expect(user).toEqual({
      _id: context.userId,
      updatedBy: context.userId,
      preferences: {
        ...omit(['a', 'b'], args),
        areEmailNotificationsEnabled: false,
      },
    });
  });
});
