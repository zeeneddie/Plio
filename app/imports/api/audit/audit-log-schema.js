import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const AuditLogSchema = new SimpleSchema({
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
  changedAt: {
    type: Date
  },
  changedBy: {
    type: String,
    regEx: /^([23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17})|system$/
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
});
