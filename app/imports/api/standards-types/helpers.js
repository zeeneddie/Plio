import { allPass } from 'ramda';
import { isDefault, eqReservedTitle } from 'plio-util';

import { DefaultStandardTypes } from '../../share/constants';

export const isStandardOperatingProcedure = allPass([
  isDefault,
  eqReservedTitle(DefaultStandardTypes.STANDARD_OPERATING_PROCEDURE.title),
]);

export const isSectionHeader = allPass([
  isDefault,
  eqReservedTitle(DefaultStandardTypes.SECTION_HEADER.title),
]);
