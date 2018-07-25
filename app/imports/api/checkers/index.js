import { $ } from 'meteor/jquery';

import { MOBILE_BREAKPOINT } from '../constants';

export * from '../actions/checkers';

export * from '../work-items/checkers';

export * from '../problems/checkers';

export * from '../standards/checkers';

export * from '../organizations/checkers';

export * from '../occurrences/checkers';

export * from '../users/checkers';

export * from '../discussions/checkers';

export * from './roles';

export * from './update';

export * from './membership';

export * from './document';

export const isMobileRes = () => {
  const width = $(window).width();
  return width <= MOBILE_BREAKPOINT && width;
};
