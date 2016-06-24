import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TimeUnits, DocumentTypes } from './constants.js';
import { Utils } from '/imports/core/utils.js';



export const IdSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  }
});

export const TimePeriodSchema = new SimpleSchema({
  timeUnit: {
    type: String,
    allowedValues: _.values(TimeUnits)
  },
  timeValue: {
    type: Number,
    min: 1
  }
});

export const NewUserDataSchema = new SimpleSchema({
  firstName: {
    type: String,
    min: 1,
    max: 20
  },
  lastName: {
    type: String,
    min: 1,
    max: 20
  },
  password: {
    type: String,
    min: 6,
    max: 20
  }
});

const idSchemaDoc = {
  type: String,
  regEx: SimpleSchema.RegEx.Id
};

export const OrganizationIdSchema = new SimpleSchema({
  organizationId: idSchemaDoc
});

export const StandardIdSchema = new SimpleSchema({
  standardId: idSchemaDoc
});

export const UserIdSchema = new SimpleSchema({
  userId: idSchemaDoc
});

export const DocumentIdSchema = new SimpleSchema({
  documentId: idSchemaDoc
});

export const DocumentTypeSchema = new SimpleSchema({
  documentType: {
    type: String,
    allowedValues: DocumentTypes
  }
});

export const optionsSchema = new SimpleSchema({
  options: {
    type: Object,
    optional: true,
    blackbox: true
  },
  query: {
    type: Object,
    optional: true,
    blackbox: true
  }
});

export const CreatedAtSchema = new SimpleSchema({
  createdAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();
      }
    }
  }
});

export const CreatedBySchema = new SimpleSchema({
  createdBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoValue() {
      if (this.isInsert) {

        // Workaround for fixtures
        return this.userId || this.isSet && this.value;
      } else {
        this.unset();
      }
    }
  }
});

export const UpdatedAtSchema = new SimpleSchema({
  updatedAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      } else {
        this.unset();
      }
    }
  }
});

export const UpdatedBySchema = new SimpleSchema({
  updatedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoValue() {
      if (this.isUpdate) {
        return this.userId;
      } else {
        this.unset();
      }
    }
  }
});

export const BaseEntitySchema = new SimpleSchema([
  CreatedAtSchema,
  CreatedBySchema,
  UpdatedAtSchema,
  UpdatedBySchema
]);

export const NotifySchema = new SimpleSchema({
  notify: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return [this.userId];
      } else {
        this.unset();
      }
    }
  }
});

export const DeletedSchema = new SimpleSchema({
  isDeleted: {
    type: Boolean,
    optional: true
  },
  deletedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  deletedAt: {
    type: Date,
    optional: true
  }
});

export const FileSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  extension: {
    type: String,
    autoValue() {
      if (this.isSet) {
        return this.value.toLowerCase();
      }
    },
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  name: {
    type: String
  }
});
