import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas';
import { StringLimits } from '../constants';


const StandardsBookSectionEditableFields = new SimpleSchema({
  title: {
    type: String,
    min: StringLimits.title.min,
    max: StringLimits.title.max,
  }
});

const StandardsBookSectionSchema = new SimpleSchema([
  BaseEntitySchema,
  StandardsBookSectionEditableFields,
  OrganizationIdSchema,
]);

export {
  StandardsBookSectionEditableFields,
  StandardsBookSectionSchema,
};
