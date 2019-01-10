import createDecorator from 'final-form-calculate';

const updateShouldRenderSource2 = (value, { source1, source2 }) => !!source1 || !!source2;

export default createDecorator(
  {
    field: 'source1',
    updates: {
      shouldRenderSource2: updateShouldRenderSource2,
    },
  },
  {
    field: 'source2',
    updates: {
      shouldRenderSource2: updateShouldRenderSource2,
    },
  },
);
