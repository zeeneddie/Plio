import { __setupDB, __closeDB, Mongo } from 'meteor/mongo';

import CostLineService from '../cost-line-service';
import { CanvasColors } from '../../constants';

describe('Cost line service', () => {
  let CostLines;

  beforeAll(__setupDB);
  afterAll(__closeDB);

  beforeEach(() => {
    CostLines = new Mongo.Collection('CostLines');
  });

  test('insert', async () => {
    const userId = 2;
    const args = {
      title: 'Hello World',
      organizationId: 1,
      color: CanvasColors.INDIGO,
      percentOfTotalCost: 50,
      originatorId: userId,
      notes: 'dlsadsad',
    };
    const context = {
      userId,
      collections: { CostLines },
    };

    const _id = await CostLineService.insert(args, context);
    const costLine = await CostLines.findOne({ _id });

    expect(costLine).toMatchObject({
      ...args,
      createdBy: userId,
    });
  });
});
