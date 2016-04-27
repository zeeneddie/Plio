import { Mongo } from 'meteor/mongo';

import { DepartmentSchema } from './department-schema.js';


const Departments = new Mongo.Collection('Departments');
Departments.attachSchema(DepartmentSchema);

export { Departments };
