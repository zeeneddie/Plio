import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const StandardsSchema = new SimpleSchema({
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
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  issueNumber: {
    type: Number
  },
  status: {
    type: String
  },
  departments: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});

const StandardsUpdateSchema = new SimpleSchema({
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
  },
  departments: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    optional: true
  }
});

export { StandardsSchema, StandardsUpdateSchema };
