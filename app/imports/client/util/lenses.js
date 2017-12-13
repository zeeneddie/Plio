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
const organization = lensProp('organization');
const orgSerialNumber = lensProp('orgSerialNumber');
const dataImport = lensProp('dataImport');
const isModalOpened = lensProp('isModalOpened');
const deletedAt = lensProp('deletedAt');
const isFullScreenMode = lensProp('isFullScreenMode');
const isCardReady = lensProp('isCardReady');
const source1 = lensProp('source1');
const source2 = lensProp('source2');
const htmlUrl = lensProp('htmlUrl');
const standard = lensProp('standard');
const discussion = lensProp('discussion');
const isDiscussionOpened = lensProp('isDiscussionOpened');
const standardBookSectionsByIds = lensProp('standardBookSectionsByIds');
const standardBookSections = lensProp('standardBookSections');
const standardTypesByIds = lensProp('standardTypesByIds');
const standardTypes = lensProp('standardTypes');
const usersByIds = lensProp('usersByIds');
const isDeleted = lensProp('isDeleted');
const isInProgress = lensProp('isInProgress');
const loading = lensProp('loading');
const dataLoading = lensProp('dataLoading');
const areDepsReady = lensProp('areDepsReady');
const initializing = lensProp('initializing');
const _window = lensProp('window');
const width = lensProp('width');
const mobile = lensProp('mobile');
const showCard = lensProp('showCard');

const collectionsStandards = compose(collections, standards);
const collectionsStandardsByIds = compose(collections, standardsByIds);
const collectionsStandardBookSections = compose(collections, standardBookSections);
const collectionsStandardBookSectionsByIds = compose(collections, standardBookSectionsByIds);
const collectionsStandardTypesByIds = compose(collections, standardTypesByIds);
const collectionsUsersByIds = compose(collections, usersByIds);
const collectionsStandardTypes = compose(collections, standardTypes);

const standardsStandardsFiltered = compose(standards, standardsFiltered);
const standardsInitializing = compose(standards, initializing);
const standardsAreDepsReady = compose(standards, areDepsReady);

const globalSearchText = compose(_global, searchText);
const globalFilter = compose(_global, filter);
const globalAnimating = compose(_global, animating);
const globalUrlItemId = compose(_global, urlItemId);
const globalUserId = compose(_global, userId);
const globalIsFullScreenMode = compose(_global, isFullScreenMode);
const globalIsCardReady = compose(_global, isCardReady);
const globalDataLoading = compose(_global, dataLoading);

const organizationsOrganizationId = compose(organizations, organizationId);
const organizationsOrganization = compose(organizations, organization);
const organizationsOrgSerialNumber = compose(organizations, orgSerialNumber);

const dataImportIsModalOpened = compose(dataImport, isModalOpened);
const dataImportIsInProgress = compose(dataImport, isInProgress);

const source1HtmlUrl = compose(source1, htmlUrl);
const source2HtmlUrl = compose(source2, htmlUrl);

const discussionisDiscussionOpened = compose(discussion, isDiscussionOpened);

const windowWidth = compose(_window, width);

const mobileShowCard = compose(mobile, showCard);

export default {
  deletedAt,
  searchText,
  standardsFiltered,
  isCardReady,
  urlItemId,
  standard,
  isDeleted,
  isInProgress,
  loading,
  organizationId,
  dataLoading,
  areDepsReady,
  initializing,
  source1: Object.assign(source1, {
    htmlUrl: source1HtmlUrl,
  }),
  source2: Object.assign(source2, {
    htmlUrl: source2HtmlUrl,
  }),
  collections: Object.assign(collections, {
    standards: collectionsStandards,
    standardsByIds: collectionsStandardsByIds,
    standardBookSections: collectionsStandardBookSections,
    standardBookSectionsByIds: collectionsStandardBookSectionsByIds,
    standardTypes: collectionsStandardTypes,
    standardTypesByIds: collectionsStandardTypesByIds,
    usersByIds: collectionsUsersByIds,
  }),
  standards: Object.assign(standards, {
    standardsFiltered: standardsStandardsFiltered,
    initializing: standardsInitializing,
    areDepsReady: standardsAreDepsReady,
  }),
  global: Object.assign(_global, {
    searchText: globalSearchText,
    filter: globalFilter,
    animating: globalAnimating,
    urlItemId: globalUrlItemId,
    userId: globalUserId,
    isFullScreenMode: globalIsFullScreenMode,
    isCardReady: globalIsCardReady,
    dataLoading: globalDataLoading,
  }),
  organizations: Object.assign(organizations, {
    organizationId: organizationsOrganizationId,
    organization: organizationsOrganization,
    orgSerialNumber: organizationsOrgSerialNumber,
  }),
  dataImport: Object.assign(dataImport, {
    isModalOpened: dataImportIsModalOpened,
    isInProgress: dataImportIsInProgress,
  }),
  discussion: Object.assign(discussion, {
    isDiscussionOpened: discussionisDiscussionOpened,
  }),
  window: Object.assign(window, {
    width: windowWidth,
  }),
  mobile: Object.assign(mobile, {
    showCard: mobileShowCard,
  }),
};
