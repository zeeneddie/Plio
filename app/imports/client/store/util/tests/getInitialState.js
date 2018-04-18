import { mergeDeepRight, reduce, assoc } from 'ramda';

import { OrgOwnerRoles, UserMembership } from '../../../../share/constants';

const normalize = reduce((acc, std) => assoc(std._id, std, acc), {});

const user = {
  _id: 6,
  roles: {
    7: OrgOwnerRoles,
  },
};

const organization = {
  _id: 7,
  serialNumber: 1,
  users: [
    {
      userId: user._id,
      role: UserMembership.ORG_OWNER,
    },
  ],
};

const users = [user];
const usersByIds = normalize(users);

const organizations = [organization];
const organizationsByIds = normalize(organizations);

const standards = [
  { _id: 1, sectionId: 8, typeId: 9 },
  { _id: 2, sectionId: 8, typeId: 9 },
  {
    _id: 3,
    sectionId: 8,
    typeId: 9,
    isDeleted: true,
    deletedAt: 1513074233019,
  },
  {
    _id: 4,
    sectionId: 8,
    typeId: 9,
    isDeleted: true,
    deletedAt: 1513074233018,
  },
  { _id: 5 },
];
const standardsByIds = normalize(standards);

const standardBookSections = [{ _id: 8 }];
const standardBookSectionsByIds = normalize(standardBookSections);

const standardTypes = [{ _id: 9 }];
const standardTypesByIds = normalize(standardTypes);

const risks = [
  {
    _id: 10,
    typeId: 15,
    departmentsIds: [16],
    standardsIds: [1],
    analysis: {
      executor: 6,
      completedBy: 6,
    },
  },
  {
    _id: 11,
    typeId: 15,
    departmentsIds: [16, 17],
    standardsIds: [1, 2],
  },
  {
    _id: 12,
    isDeleted: true,
    deletedAt: 1513074233019,
    typeId: 15,
    departmentsIds: [17],
    standardsIds: [5],
  },
  {
    _id: 13,
    isDeleted: true,
    deletedAt: 1513074233018,
    standardsIds: [1],
    departmentsIds: [],
  },
  { _id: 14, standardsIds: [2], departmentsIds: [] },
];
const risksByIds = normalize(risks);
const riskTypes = [{ _id: 15 }];
const riskTypesByIds = normalize(riskTypes);
const departments = [
  { _id: 16 },
  { _id: 17 },
];
const departmentsByIds = normalize(departments);

export default mergeDeepRight({
  standards: {
    standardsFiltered: [],
  },
  risks: {
    risksFiltered: [],
  },
  organizations: {
    organizationId: 7,
    orgSerialNumber: 1,
    organization,
  },
  discussion: {
    isDiscussionOpened: false,
  },
  dataImport: {
    isModalOpened: false,
  },
  collections: {
    standards,
    standardsByIds,
    users,
    usersByIds,
    organizations,
    organizationsByIds,
    standardBookSections,
    standardBookSectionsByIds,
    standardTypes,
    standardTypesByIds,
    risks,
    risksByIds,
    riskTypes,
    riskTypesByIds,
    departments,
    departmentsByIds,
  },
  global: {
    filter: 1,
    searchText: '',
    isCardReady: true,
    isFullScreenMode: false,
    urlItemId: standards[0]._id,
    userId: user._id,
  },
});
