import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TimeUnits } from './constants.js';


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
    min: 0
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
        return this.userId;
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
