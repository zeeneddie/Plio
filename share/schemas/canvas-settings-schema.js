import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { BaseEntitySchema, OrganizationIdSchema } from './schemas';
import CanvasSectionSettingsSchema from './canvas-section-settings-schema';

const CanvasSettingsSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  {
    keyPartners: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
    keyActivities: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
    keyResources: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
    valuePropositions: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
    customerRelationships: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
    channels: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
    customerSegments: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
    costStructure: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
    revenueStreams: {
      type: CanvasSectionSettingsSchema,
      optional: true,
    },
  },
]);

export default CanvasSettingsSchema;
