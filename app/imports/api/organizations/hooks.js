import { Organizations } from './organizations.js';
import { StandardsTypes } from '../standards-types/standards-types.js';
import StandardsTypeService from '../standards-types/standards-type-service.js';

const defaultStandardsTypes = [
  {
    name: 'Customer experience',
    abbreviation: 'CEX'
  },
  {
    name: 'Policy',
    abbreviation: 'POL'
  },
  {
    name: 'Procedure',
    abbreviation: 'PRO'
  },
  {
    name: 'Regulation',
    abbreviation: 'REG'
  },
  {
    name: 'Specification',
    abbreviation: 'SPEC'
  },
  {
    name: 'Standard Operating Procedure',
    abbreviation: 'SOP'
  },
  {
    name: 'Process',
    abbreviation: 'PRO'
  },
  {
    name: 'Work instruction',
    abbreviation: 'WORK'
  },
  {
    name: 'Test method',
    abbreviation: 'TEST'
  }
];


Organizations.after.insert((userId, { _id }) => {
  _.each(defaultStandardsTypes, ({ name, abbreviation }) => {
    if (!StandardsTypes.findOne({ organizationId: _id, name, abbreviation })) {
      StandardsTypeService.insert({ organizationId: _id, name, abbreviation });
    }
  });
});
