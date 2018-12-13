import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { invert, map } from 'ramda';

import { BaseEntitySchema, idSchemaDoc } from './schemas';
import { CanvasSections } from '../constants';

const CanvasSectionSettingsSchema = new SimpleSchema({
  order: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
  },
});

const applySectionSchema = () => ({
  type: CanvasSectionSettingsSchema,
  optional: true,
});

const CanvasSettingsSchema = new SimpleSchema([
  BaseEntitySchema,
  map(applySectionSchema, invert(CanvasSections)),
  {
    organizationId: {
      ...idSchemaDoc,
      index: 1,
      unique: true,
    },
    notify: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
    },
  },
]);

export default CanvasSettingsSchema;
