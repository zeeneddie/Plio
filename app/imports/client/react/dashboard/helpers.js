import pluralize from 'pluralize';
import { lowerCaseLastSChar } from 'plio-util';

import { HomeScreenTitlesTypes } from '../../../share/constants';

export const getMetrics = (text, count) => lowerCaseLastSChar(pluralize(text, count, true));

export const getRouteName = (key) => {
  switch (key) {
    case HomeScreenTitlesTypes.NON_CONFORMITIES:
      return 'nonconformities';
    default:
      return key;
  }
};

export const getIconName = key => ({
  [HomeScreenTitlesTypes.STANDARDS]: 'book',
  [HomeScreenTitlesTypes.RISKS]: 'bolt',
  [HomeScreenTitlesTypes.NON_CONFORMITIES]: 'exclamation-triangle',
  [HomeScreenTitlesTypes.WORK_INBOX]: 'inbox',
})[key];

export const getMetricText = key => ({
  [HomeScreenTitlesTypes.STANDARDS]: 'standard',
  [HomeScreenTitlesTypes.RISKS]: 'risk',
  [HomeScreenTitlesTypes.NON_CONFORMITIES]: 'NC',
  [HomeScreenTitlesTypes.WORK_INBOX]: 'item',
})[key];
