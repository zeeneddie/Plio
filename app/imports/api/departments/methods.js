import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { DepartmentSchema } from './department-schema';
import DepartmentService from './department-service.js';
import { IdSchema } from '../schemas.js';


export const insert = new ValidatedMethod({
  name: 'Departments.insert',

  validate: DepartmentSchema.validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot create a department'
      );
    }

    return DepartmentService.insert(doc);
  }
});

export const update = new ValidatedMethod({
  name: 'Departments.update',

  validate: new SimpleSchema([IdSchema, {
    name: { type: String }
  }]).validator(),

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

  validate: IdSchema.validator(),

  run(doc) {
    if (!this.userId) {
      throw new Meteor.Error(
        403, 'Unauthorized user cannot remove a department'
      );
    }

    return DepartmentService.remove(doc);
  }
});
