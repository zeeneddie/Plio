import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { idSchemaDoc } from '../schemas.js';


export const DiscussionsSchema = new SimpleSchema([
  {
    documentType: {
      type: String
    },
    linkedTo: idSchemaDoc
  }
]);
