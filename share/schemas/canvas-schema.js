import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  BaseEntitySchema,
  OrganizationIdSchema,
  idSchemaDoc,
  FileIdsSchema,
} from './schemas';
import { StringLimits, CanvasColors } from '../constants';
import { CanvasSettings } from '../collections';

const CanvasSchema = new SimpleSchema([
  BaseEntitySchema,
  OrganizationIdSchema,
  FileIdsSchema,
  {
    title: {
      type: String,
      min: StringLimits.title.min,
      max: StringLimits.title.max,
    },
    originatorId: idSchemaDoc,
    notes: {
      type: String,
      optional: true,
      max: StringLimits.description.max,
    },
    color: {
      type: String,
      allowedValues: Object.values(CanvasColors),
    },
    notify: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      autoValue() {
        if (this.isInsert) {
          const organizationId = this.field('organizationId');

          if (organizationId.isSet) {
            const settings = CanvasSettings.findOne({ organizationId: organizationId.value }, {
              fields: { notify: 1 },
            }) || {};
            const { notify } = settings;

            if (notify && notify.length) return notify;
          }

          return [];
        }

        return undefined;
      },
    },
  },
]);

export default CanvasSchema;
