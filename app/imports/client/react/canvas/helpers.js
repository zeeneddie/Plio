import {
  compose,
  join,
  flatten,
  juxt,
  prepend,
  append,
  of,
  length,
  ifElse,
  always,
  filter,
  whereEq,
  map,
  pick,
  reduce,
  mergeWith,
  uniq,
  concat,
  addIndex,
  sum,
  subtract,
  reject,
  isNil,
  pathOr,
} from 'ramda';

import {
  ImportanceValues,
  CustomerElementStatuses,
  Criticality,
  CriticalityLevels,
  Colors,
  MAX_TOTAL_PERCENT,
  DEFAULT_CANVAS_COLOR,
} from '../../../share/constants';

export const getCustomerElementInitialValues = () => ({
  title: '',
  description: '',
  importance: ImportanceValues[0],
});

export const getMatchText = compose(
  join(''),
  flatten,
  juxt([
    compose(
      prepend('('),
      of,
      length,
    ),
    compose(
      ifElse(
        length,
        compose(
          append(' matched'),
          prepend(', '),
          of,
          length,
        ),
        always(''),
      ),
      filter(whereEq({ status: CustomerElementStatuses.MATCHED })),
    ),
    always(')'),
  ]),
);

const {
  [Criticality.VERY_LOW]: veryLow,
  [Criticality.LOW]: low,
  [Criticality.MEDIUM]: medium,
  [Criticality.HIGH]: high,
  [Criticality.VERY_HIGH]: veryHigh,
} = CriticalityLevels;

export const getCriticalityLevelLabel = (value) => {
  if (value <= veryLow.max) {
    return veryLow.label;
  } else if (value <= low.max) {
    return low.label;
  } else if (value <= medium.max) {
    return medium.label;
  } else if (value <= high.max) {
    return high.label;
  }
  return veryHigh.label;
};

export const getCriticalityValueLabel = value => `${getCriticalityLevelLabel(value)} - ${value}%`;

const pickLinkedDocs = map(pick([
  'goals',
  'standards',
  'risks',
  'nonconformities',
  'potentialGains',
]));
const mergeAllWithConcat = reduce(mergeWith(compose(uniq, concat)), {});
export const buildLinkedDocsData = compose(mergeAllWithConcat, pickLinkedDocs);

const palette = Object.values(Colors);
const getColorByIndex = index => palette[index % palette.length];
export const generateColors = addIndex(map)((item, index) => getColorByIndex(index));

export const getOtherPercent = compose(
  subtract(MAX_TOTAL_PERCENT),
  sum,
  reject(isNil),
);

export const getKeyPartnerChartData = addIndex(map)(({
  levelOfSpend,
  criticality,
  title,
}, index) => ({
  data: [{ x: levelOfSpend, y: criticality }],
  backgroundColor: getColorByIndex(index),
  label: title,
}));

export const getUserDefaultCanvasColor = pathOr(
  DEFAULT_CANVAS_COLOR,
  ['preferences', 'defaultCanvasColor'],
);
