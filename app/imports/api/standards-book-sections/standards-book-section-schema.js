import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const StandardsBookSectionEditableFields = new SimpleSchema({
  title: {
    type: String,
    regEx: /^([0-9]+)\.(.+)$/
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
