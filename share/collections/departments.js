import { Mongo } from 'meteor/mongo';

import { DepartmentSchema } from '../schemas/department-schema.js';


const Departments = new Mongo.Collection('Departments');
Departments.attachSchema(DepartmentSchema);

export { Departments };
