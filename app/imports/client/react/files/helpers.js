import { equals } from 'ramda';

import { FileStatuses } from '../../../share/constants';

export const isFailed = status =>
  status === FileStatuses.FAILED || status === FileStatuses.TERMINATED;

export const isUploaded = equals(1);
