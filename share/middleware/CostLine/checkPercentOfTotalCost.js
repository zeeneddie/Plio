import checkPercentField from '../Document/checkPercentField';

export default (config = () => ({})) =>
  checkPercentField(async (root, args, context) => ({
    ...await config(root, args, context),
    collection: context.collections.CostLines,
    key: 'percentOfTotalCost',
    entityName: 'Cost lines',
  }));
