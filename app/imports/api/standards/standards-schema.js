import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { OrganizationIdSchema } from '../schemas.js';


const optionalFields = new SimpleSchema({
  description: {
    type: String,
    optional: true
  },
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
  },
  createdAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
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
  },
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
  },
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
  },
  approved: {
    type: Boolean,
    optional: true
  },
  approvedAt: {
    type: Date,
    optional: true
  },
  notes: {
    type: String,
    optional: true
  },
  departments: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  source1: {
    type: Object,
    optional: true
  },
  'source1.type': {
    type: String
  },
  'source1.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  'source1.name': {
    type: String,
    optional: true
  },
  source2: {
    type: Object,
    optional: true
  },
  'source2.type': {
    type: String
  },
  'source2.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  'source2.name': {
    type: String,
    optional: true
  },
  notify: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  lessons: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  improvementPlan: {
    type: Object,
    optional: true
  },
  'improvementPlan.desiredOutcome': {
    type: String,
    optional: true
  },
  'improvementPlan.targetDate': {
    type: Date,
    optional: true
  },
  'improvementPlan.reviewDates': {
    type: [Object],
    optional: true
  },
  'improvementPlan.reviewDates.$.date': {
    type: Date
  },
  'improvementPlan.reviewDates.$._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'improvementPlan.owner': {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  'improvementPlan.selectedMetric': {
    type: String,
    optional: true
  },
  'improvementPlan.currentValue': {
    type: String,
    optional: true
  },
  'improvementPlan.targetValue': {
    type: String,
    optional: true
  },
  'improvementPlan.files': {
    type: [Object],
    optional: true
  },
  'improvementPlan.files.$._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'improvementPlan.files.$.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  'improvementPlan.files.$.name': {
    type: String
  },
  viewedBy: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return [this.userId];
      }
    }
  }
});

const StandardsSchema = new SimpleSchema([
  optionalFields,
  OrganizationIdSchema,
  {
    title: {
      type: String
    },
    typeId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    sectionId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    nestingLevel: {
      type: Number
    },
    owner: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    issueNumber: {
      type: Number
    },
    status: {
      type: String
    }
  }
]);

const StandardsUpdateSchema = new SimpleSchema([optionalFields, {
  title: {
    type: String,
    optional: true
  },
  typeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  sectionId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  nestingLevel: {
    type: Number,
    optional: true
  },
  description: {
    type: String,
    optional: true
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  },
  issueNumber: {
    type: Number,
    optional: true
  },
  status: {
    type: String,
    optional: true
  }
}]);

export { StandardsSchema, StandardsUpdateSchema };
