import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { invert, map } from 'ramda';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas';
import { CanvasSections } from '../constants';
import CanvasSectionSettingsSchema from './canvas-section-settings-schema';

const setSchemaFieldOptions = () => ({
  type: CanvasSectionSettingsSchema,
  optional: true,
});

const CanvasSettingsSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  map(setSchemaFieldOptions, invert(CanvasSections)),
]);

export default CanvasSettingsSchema;
