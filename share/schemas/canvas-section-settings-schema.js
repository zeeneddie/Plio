import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const CanvasSectionSettingsSchema = new SimpleSchema({
  order: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
  },
});

export default CanvasSectionSettingsSchema;
