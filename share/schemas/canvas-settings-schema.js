import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { invert, map } from 'ramda';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas';
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
  OrganizationIdSchema,
  map(applySectionSchema, invert(CanvasSections)),
]);

export default CanvasSettingsSchema;
