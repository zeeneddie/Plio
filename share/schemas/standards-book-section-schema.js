import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas.js';
import { StringLimits } from '/imports/share/constants.js';


const StandardsBookSectionEditableFields = new SimpleSchema({
  title: {
    type: String,
    min: StringLimits.title.min,
    max: StringLimits.title.max
  }
});

const StandardsBookSectionSchema = new SimpleSchema([
  BaseEntitySchema,
  StandardsBookSectionEditableFields,
  OrganizationIdSchema
]);

export {
  StandardsBookSectionEditableFields,
  StandardsBookSectionSchema
};
