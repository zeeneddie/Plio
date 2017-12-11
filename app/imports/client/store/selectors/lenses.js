import { compose, lensProp } from 'ramda';

const collections = lensProp('collections');
const standards = lensProp('standards');
const standardsByIds = lensProp('standardsByIds');
const standardsFiltered = lensProp('standardsFiltered');
const _global = lensProp('global');
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
const isFullScreenMode = lensProp('isFullScreenMode');
const isCardReady = lensProp('isCardReady');

const collectionsStandards = compose(collections, standards);
const collectionsStandardsByIds = compose(collections, standardsByIds);

const standardsStandardsFiltered = compose(standards, standardsFiltered);

const globalSearchText = compose(_global, searchText);
const globalFilter = compose(_global, filter);
const globalAnimating = compose(_global, animating);
const globalUrlItemId = compose(_global, urlItemId);
const globalUserId = compose(_global, userId);
const globalIsFullScreenMode = compose(_global, isFullScreenMode);
const globalIsCardReady = compose(_global, isCardReady);

const organizationsOrganizationId = compose(organizations, organizationId);

const dataImportIsModalOpened = compose(dataImport, isModalOpened);

export default {
  deletedAt,
  searchText,
  standardsFiltered,
  collections: Object.assign(collections, {
    standards: collectionsStandards,
    standardsByIds: collectionsStandardsByIds,
  }),
  standards: Object.assign(standards, {
    standardsFiltered: standardsStandardsFiltered,
  }),
  global: Object.assign(_global, {
    searchText: globalSearchText,
    filter: globalFilter,
    animating: globalAnimating,
    urlItemId: globalUrlItemId,
    userId: globalUserId,
    isFullScreenMode: globalIsFullScreenMode,
    isCardReady: globalIsCardReady,
  }),
  organizations: Object.assign(organizations, {
    organizationId: organizationsOrganizationId,
  }),
  dataImport: Object.assign(dataImport, {
    isModalOpened: dataImportIsModalOpened,
  }),
};
