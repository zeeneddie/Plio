import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import DepartmentService from './department-service.js';


export const insert = new ValidatedMethod({
  name: 'Departments.insert',

  validate: new SimpleSchema({
    name: { type: String },
    organizationId: {
      type: String
    }
  }).validator(),

  run(doc) {
    const userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a department'
      );
    }

    return DepartmentService.insert(doc);
  }
});

export const update = new ValidatedMethod({
  name: 'Departments.update',

  validate: new SimpleSchema({
    _id: {
      type: String
    },
    name: { type: String }
  }).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot update a department'
      );
    }

    return DepartmentService.update(doc);
  }
});

export const remove = new ValidatedMethod({
  name: 'Departments.remove',

  validate: new SimpleSchema({
    _id: {
      type: String
    }
  }).validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a department'
      );
    }

    return DepartmentService.remove(doc);
  }
});
