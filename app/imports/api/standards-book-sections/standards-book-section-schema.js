import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { OrganizationIdSchema } from '../schemas.js';


const StandardsBookSectionEditableFields = new SimpleSchema({
  title: {
    type: String,
    min: 1
  }
});

const StandardsBookSectionSchema = new SimpleSchema([
  StandardsBookSectionEditableFields,
  OrganizationIdSchema
]);

export {
  StandardsBookSectionEditableFields,
  StandardsBookSectionSchema
};
