import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { SystemName } from '../constants';
import { OrganizationIdSchema } from './schemas';


export const AuditLogSchema = new SimpleSchema([
  OrganizationIdSchema,
  {
    collection: {
      type: String
    },
    documentId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    message: {
      type: String
    },
    date: {
      type: Date
    },
    executor: {
      type: String,
      regEx: new RegExp(
        `^([23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17})|${SystemName}$`
      )
    },
    field: {
      type: String,
      optional: true
    },
    oldValue: {
      // workaround for https://github.com/aldeed/meteor-simple-schema/issues/174
      // value may have different type (string, number, boolean, etc.)
      type: null,
      optional: true
    },
    newValue: {
      // workaround for https://github.com/aldeed/meteor-simple-schema/issues/174
      // value may have different type (string, number, boolean, etc.)
      type: null,
      optional: true
    }
  }
]);
