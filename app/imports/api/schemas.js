import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {
  TimeUnits, DocumentTypes, AnalysisStatuses,
  ReviewStatuses
} from './constants.js';
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
    min: 1,
    max: 999
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

export const FilesSchema = new SimpleSchema({
  'files': {
    type: [Object],
    optional: true
  },
  'files.$._id': {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  'files.$.extension': {
    type: String,
    autoValue() {
      if (this.isSet) {
        return this.value.toLowerCase();
      }
    },
  },
  'files.$.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  'files.$.name': {
    type: String
  }
});

export const getNotifySchema = (field) => {
  return new SimpleSchema({
    notify: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
      autoValue() {
        if (this.isInsert) {
          const userIdField = this.field(field);
          if (userIdField.isSet) {
            return [userIdField.value];
          } else {
            this.unset();
          }
        }
      }
    }
  });
};

export const ViewedBySchema = new SimpleSchema({
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

export const BaseProblemsRequiredSchema = new SimpleSchema([
  OrganizationIdSchema,
  {
    title: {
      type: String,
      min: 1,
      max: 40
    },
    identifiedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    identifiedAt: {
      type: Date
    },
    magnitude: {
      type: String
    },
    standardsIds: {
      type: [String],
      regEx: SimpleSchema.RegEx.Id,
      minCount: 1
    }
  }
]);

export const BaseProblemsOptionalSchema = ((() => {
  const getRepeatingFields = (key) => {
    return {
      [`${key}.targetDate`]: {
        type: Date,
        optional: true
      },
      [`${key}.status`]: {
        type: Number,
        allowedValues: _.keys(AnalysisStatuses).map(status => parseInt(status, 10)),
        defaultValue: 0,
        optional: true
      },
      [`${key}.completedAt`]: {
        type: Date,
        optional: true
      },
      [`${key}.completedBy`]: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
      }
    };
  };

  const analysis = {
    analysis: {
      type: Object,
      optional: true
    },
    'analysis.executor': {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    ...getRepeatingFields('analysis')
  };

  const updateOfStandards = {
    updateOfStandards: {
      type: Object,
      optional: true
    },
    ...getRepeatingFields('updateOfStandards')
  };

  return new SimpleSchema([
    DeletedSchema,
    ViewedBySchema,
    FilesSchema,
    getNotifySchema('identifiedBy'),
    {
      description: {
        type: String,
        optional: true
      },
      departmentsIds: {
        type: [String],
        regEx: SimpleSchema.RegEx.Id,
        optional: true
      },
      ...analysis,
      ...updateOfStandards
    }
  ]);

})());

export const ReviewSchema = ((() => {
  const schema = new SimpleSchema({
    status: {
      type: Number,
      allowedValues: _.keys(ReviewStatuses).map(status => parseInt(status, 10)),
      defaultValue: 2
    },
    reviewedAt: {
      type: Date,
      optional: true
    },
    reviewedBy: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true
    },
    comments: {
      type: String,
      max: 140,
      optional: true
    }
  });

  return new SimpleSchema({
    review: {
      type: schema,
      optional: true
    }
  });
})());
