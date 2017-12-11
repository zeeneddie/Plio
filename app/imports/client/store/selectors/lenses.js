import { compose, lensProp } from 'ramda';

const collections = lensProp('collections');
const standards = lensProp('standards');
const standardsByIds = lensProp('standardsByIds');
const standardsFiltered = lensProp('standardsFiltered');
const global = lensProp('global');
const searchText = lensProp('searchText');
const filter = lensProp('filter');
const animating = lensProp('animating');
const urlItemId = lensProp('urlItemId');
const userId = lensProp('userId');
const organizations = lensProp('organizations');
const organizationId = lensProp('organizationId');
const dataImport = lensProp('dataImport');
const isModalOpened = lensProp('isModalOpened');
const deletedAt = lensProp('deletedAt');

const collectionsStandards = compose(collections, standards);
const collectionsStandardsByIds = compose(collections, standardsByIds);

const standardsStandardsFiltered = compose(standards, standardsFiltered);

const globalSearchText = compose(global, searchText);
const globalFilter = compose(global, filter);
const globalAnimating = compose(global, animating);
const globalUrlItemId = compose(global, urlItemId);
const globalUserId = compose(global, userId);

const organizationsOrganizationId = compose(organizations, organizationId);

const dataImportIsModalOpened = compose(dataImport, isModalOpened);

export default {
  deletedAt,
  collections: Object.assign(collections, {
    standards: collectionsStandards,
    standardsByIds: collectionsStandardsByIds,
  }),
  standards: Object.assign(standards, {
    standardsFiltered: standardsStandardsFiltered,
  }),
  global: Object.assign(global, {
    searchText: globalSearchText,
    filter: globalFilter,
    animating: globalAnimating,
    urlItemId: globalUrlItemId,
    userId: globalUserId,
  }),
  organizations: Object.assign(organizations, {
    organizationId: organizationsOrganizationId,
  }),
  dataImport: Object.assign(dataImport, {
    isModalOpened: dataImportIsModalOpened,
  }),
};
