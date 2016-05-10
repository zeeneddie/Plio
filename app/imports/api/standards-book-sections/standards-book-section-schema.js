import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const StandardsBookSectionEditableFields = new SimpleSchema({
  title: {
    type: String
  }
});

const StandardsBookSectionSchema = new SimpleSchema([
  StandardsBookSectionEditableFields,
  {
    organizationId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }
]);

export {
  StandardsBookSectionEditableFields,
  StandardsBookSectionSchema
};
