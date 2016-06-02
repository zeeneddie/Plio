import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from '../schemas.js';


const ProblemsSectionEditableFields = new SimpleSchema({
  title: {
    type: String,
    min: 1
  }
});

const ProblemsSectionSchema = new SimpleSchema([
  BaseEntitySchema,
  ProblemsSectionEditableFields,
  OrganizationIdSchema
]);

export {
  ProblemsSectionEditableFields,
  ProblemsSectionSchema
};
