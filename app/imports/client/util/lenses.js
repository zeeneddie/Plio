import { compose, lensProp, lensIndex, curryN, defaultTo, view } from 'ramda';

export const viewOr = curryN(
  3,
  (defaultValue, lens, data) => defaultTo(defaultValue, view(lens, data)),
);

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
const users = lensProp('users');
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
const risks = lensProp('risks');
const risksByIds = lensProp('risksByIds');
const risksFiltered = lensProp('risksFiltered');
const sequentialId = lensProp('sequentialId');
const typeId = lensProp('typeId');
const sectionId = lensProp('sectionId');
const riskTypes = lensProp('riskTypes');
const riskTypesByIds = lensProp('riskTypesByIds');
const departments = lensProp('departments');
const departmentsByIds = lensProp('departmentsByIds');
const departmentsIds = lensProp('departmentsIds');
const _id = lensProp('_id');
const id = lensProp('id');
const workItems = lensProp('workItems');
const workItemsByIds = lensProp('workItemsByIds');
const lessons = lensProp('lessons');
const lessonsByIds = lensProp('lessonsByIds');
const actions = lensProp('actions');
const actionsByIds = lensProp('actionsByIds');
const target = lensProp('target');
const value = lensProp('value');
const profile = lensProp('profile');
const firstName = lensProp('firstName');
const originatorId = lensProp('originatorId');
const ownerId = lensProp('ownerId');
const options = lensProp('options');
const rkGuidelines = lensProp('rkGuidelines');
const ncGuidelines = lensProp('ncGuidelines');
const types = lensProp('types');
const selected = lensProp('selected');
const items = lensProp('items');
const standardsIds = lensProp('standardsIds');

const head = lensIndex(0);

const collectionsStandards = compose(collections, standards);
const collectionsStandardsByIds = compose(collections, standardsByIds);
const collectionsStandardBookSections = compose(collections, standardBookSections);
const collectionsStandardBookSectionsByIds = compose(collections, standardBookSectionsByIds);
const collectionsStandardTypesByIds = compose(collections, standardTypesByIds);
const collectionsUsers = compose(collections, users);
const collectionsUsersByIds = compose(collections, usersByIds);
const collectionsStandardTypes = compose(collections, standardTypes);
const collectionsRisks = compose(collections, risks);
const collectionsRisksByIds = compose(collections, risksByIds);
const collectionsRiskTypes = compose(collections, riskTypes);
const collectionsRiskTypesByIds = compose(collections, riskTypesByIds);
const collectionsDepartments = compose(collections, departments);
const collectionsDepartmentsByIds = compose(collections, departmentsByIds);
const collectionsWorkItems = compose(collections, workItems);
const collectionsWorkItemsByIds = compose(collections, workItemsByIds);
const collectionsLessons = compose(collections, lessons);
const collectionsLessonsByIds = compose(collections, lessonsByIds);
const collectionsActions = compose(collections, actions);
const collectionsActionsByIds = compose(collections, actionsByIds);

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
const organizationsOrganizationRkGuidelines = compose(organizationsOrganization, rkGuidelines);
const organizationsOrganizationNcGuidelines = compose(organizationsOrganization, ncGuidelines);
const organizationsOrgSerialNumber = compose(organizations, orgSerialNumber);

const dataImportIsModalOpened = compose(dataImport, isModalOpened);
const dataImportIsInProgress = compose(dataImport, isInProgress);

const source1HtmlUrl = compose(source1, htmlUrl);
const source2HtmlUrl = compose(source2, htmlUrl);

const discussionisDiscussionOpened = compose(discussion, isDiscussionOpened);

const windowWidth = compose(_window, width);

const mobileShowCard = compose(mobile, showCard);

const risksInitializing = compose(risks, initializing);
const risksAreDepsReady = compose(risks, areDepsReady);
const risksRisksFiltered = compose(risks, risksFiltered);

const targetValue = compose(target, value);

const profileFirstName = compose(profile, firstName);

const headValue = compose(head, value);

const typesHead = compose(types, head);
const typesHeadValue = compose(types, head, value);

const itemsHead = compose(items, head);
const itemsHeadValue = compose(items, head, value);

export default {
  _id,
  id,
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
  sequentialId,
  typeId,
  sectionId,
  departmentsIds,
  originatorId,
  ownerId,
  userId,
  options,
  selected,
  value,
  standardsIds,
  users,
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
    users: collectionsUsers,
    usersByIds: collectionsUsersByIds,
    risks: collectionsRisks,
    risksByIds: collectionsRisksByIds,
    riskTypes: collectionsRiskTypes,
    riskTypesByIds: collectionsRiskTypesByIds,
    departments: collectionsDepartments,
    departmentsByIds: collectionsDepartmentsByIds,
    workItems: collectionsWorkItems,
    workItemsByIds: collectionsWorkItemsByIds,
    lessons: collectionsLessons,
    lessonsByIds: collectionsLessonsByIds,
    actions: collectionsActions,
    actionsByIds: collectionsActionsByIds,
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
    orgSerialNumber: organizationsOrgSerialNumber,
    organization: Object.assign(organizationsOrganization, {
      ncGuidelines: organizationsOrganizationNcGuidelines,
      rkGuidelines: organizationsOrganizationRkGuidelines,
    }),
  }),
  dataImport: Object.assign(dataImport, {
    isModalOpened: dataImportIsModalOpened,
    isInProgress: dataImportIsInProgress,
  }),
  discussion: Object.assign(discussion, {
    isDiscussionOpened: discussionisDiscussionOpened,
  }),
  window: Object.assign(_window, {
    width: windowWidth,
  }),
  mobile: Object.assign(mobile, {
    showCard: mobileShowCard,
  }),
  risks: Object.assign(risks, {
    initializing: risksInitializing,
    areDepsReady: risksAreDepsReady,
    risksFiltered: risksRisksFiltered,
  }),
  target: Object.assign(target, {
    value: targetValue,
  }),
  profile: Object.assign(profile, {
    firstName: profileFirstName,
  }),
  head: Object.assign(head, {
    value: headValue,
  }),
  types: Object.assign(types, {
    head: Object.assign(typesHead, {
      value: typesHeadValue,
    }),
  }),
  items: Object.assign(items, {
    head: Object.assign(itemsHead, {
      value: itemsHeadValue,
    }),
  }),
};
