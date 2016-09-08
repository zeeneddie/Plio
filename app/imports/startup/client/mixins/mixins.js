import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Discussions } from '/imports/api/discussions/discussions.js';
import { Messages } from '/imports/api/messages/messages.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { getJoinUserToOrganizationDate } from '/imports/api/organizations/utils.js';
import { Standards } from '/imports/api/standards/standards.js';
import { Departments } from '/imports/api/departments/departments.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { Actions } from '/imports/api/actions/actions.js';
import { WorkItems } from '/imports/api/work-items/work-items.js';
import invoke from 'lodash.invoke';
import {
  DocumentTypes, UserRoles, StandardFilters, RiskFilters,
  NonConformityFilters, ProblemGuidelineTypes, ProblemsStatuses,
  OrgCurrencies, ActionStatuses, WorkInboxFilters,
  ActionTypes, ReviewStatuses, WorkItemsStore
} from '/imports/api/constants.js';
import { insert as insertFile, updateUrl, updateProgress, terminateUploading } from '/imports/api/files/methods.js'
import Counter from '/imports/api/counter/client.js';
import { Match, check } from 'meteor/check';

const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
const vimeoRegex = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;

ViewModel.persist = false;

export default {
  collapse: {
    collapsed: true,
    toggleCollapse: _.throttle(function(cb, timeout) {
      // Callback is always the last argument
      timeout = Match.test(timeout, Number) ? timeout : null;

      if (this.closeAllOnCollapse && this.closeAllOnCollapse()) {
        const vms = ViewModel.find('ListItem', vm => vm.collapse && !vm.collapsed() && vm.vmId !== this.vmId);
        vms.forEach((vm) => {
          vm.collapse.collapse('hide');
          vm.collapsed(true);
        });
      }

      if (this.collapsed() && timeout) {
        // We need some time to render the content for collapsible sections with dynamic content
        setTimeout(() => { this.collapse.collapse('toggle') }, timeout);
      } else {
        this.collapse.collapse('toggle');
      }

      this.collapsed(!this.collapsed());
      if (_.isFunction(cb)) cb();
    }, 500)
  },
  iframe: {
    isIframeReady: false,
    onRendered() {
      Meteor.setTimeout(() => {
        this.isIframeReady(true);
      }, 300);
    }
  },
  collapsing: {
    toggleVMCollapse(name = '', condition = () => {}, cb) {
      let vmsToCollapse = [];

      if (!name && !!condition) {
        vmsToCollapse = ViewModel.find(condition);
      } else if (!!name && !!condition) {
        vmsToCollapse = ViewModel.find(name, condition);
      }

      vmsToCollapse.length > 0 && this.expandCollapseItems(vmsToCollapse, { complete: cb });
    },
    expandCollapsed: _.debounce(function(_id, cb) {
      const vms = ViewModel.find('ListItem', viewmodel => viewmodel.collapsed() && this.findRecursive(viewmodel, _id));

      return this.expandCollapseItems(vms, { complete: cb });
    }, 200),
    findRecursive(viewmodel, _id) {
      if (_.isArray(_id)) {
        return viewmodel && _.some(viewmodel.children(), vm => ( vm._id && _.contains(_id, vm._id()) || this.findRecursive(vm, _id) ));
      } else {
        return viewmodel && _.some(viewmodel.children(), vm => (vm._id && vm._id() === _id) || this.findRecursive(vm, _id) );
      }
    },
    // Recursive function to expand items one after another
    expandCollapseItems(array = [], { index = 0, complete = () => {}, expandNotExpandable = false } = {}) {
      if (array.length === 0 && _.isFunction(complete)) return complete();

      if (index >= array.length) return;

      const item = array[index];

      const closeAllOnCollapse = item.closeAllOnCollapse.value; // nonreactive value

      !!expandNotExpandable && !!closeAllOnCollapse && item.closeAllOnCollapse(false);

      const cb = () => {
        !!expandNotExpandable && !!closeAllOnCollapse && item.closeAllOnCollapse(true);

        if (index === array.length - 1 && _.isFunction(complete)) complete();

        return this.expandCollapseItems(array, { index: index + 1, complete, expandNotExpandable });
      };

      return item.toggleCollapse(cb);
    }
  },
  modal: {
    modal: {
      instance() {
        return ViewModel.findOne('ModalWindow');
      },
      open(data) {
        Blaze.renderWithData(Template.ModalWindow, data, document.body);
      },
      close() {
        this.instance() && this.instance().modal.modal('hide');
      },
      isSaving(val) {
        const instance = this.instance();

        if (val !== undefined) {
          instance && instance.isSaving(val);
        }

        return instance && instance.isSaving();
      },
      isWaiting(val) {
        const instance = this.instance();

        if (val !== undefined) {
          instance.isWaiting(val);
        }

        return instance.isWaiting();
      },
      setError(err) {
        return this.instance() && this.instance().setError(err);
      },
      clearError() {
        return this.instance() && this.instance().clearError();
      },
      callMethod(method, args, cb) {
        return this.instance() && this.instance().callMethod(method, args, cb);
      },
      handleMethodResult(cb) {
        return this.instance() && this.instance().handleMethodResult(cb);
      }
    }
  },
  search: {
    searchObject(prop, fields) {
      const searchObject = {};

      if (this[prop]()) {
        const words = this[prop]().trim().split(' ');
        let r;
        try {
          r = new RegExp(`.*(${words.join(' ')}).*`, 'i')
        } catch(err) {} // ignore errors
        if (_.isArray(fields)) {
          fields = _.map(fields, (field) => {
            const obj = {};
            obj[field.name] = field.subField ? { $elemMatch: { [field.subField]: r } } : r;
            return obj;
          });
          searchObject['$or'] = fields;
        } else {
          searchObject[fields] = r;
        }
      }

      return searchObject;
    },
    searchResultsNumber: 0,
    searchResultsText() {
      return `${this.searchResultsNumber()} matching results`;
    }
  },
  numberRegex: {
    parseNumber(string) {
      return string.match(/^[\d\.]*\d/);
    }
  },
  urlRegex: {
    IsValidUrl(url) {
      return SimpleSchema.RegEx.Url.test(url);
    },
    isYoutubeUrl(url) {
      return youtubeRegex.test(url);
    },
    getIdFromYoutubeUrl(url) {
      const videoId = url.match(youtubeRegex)[1];
      if (!videoId) return '';
      return videoId;
    },
    isVimeoUrl(url) {
      return vimeoRegex.test(url);
    },
    getIdFromVimeoUrl(url) {
      const match = url.match(vimeoRegex);
      if (!match) return false;
      return match[4];
    }
  },
  addForm: {
    addForm(template, context = {}, parentNode, nextNode, parentView) {
      if (_.isFunction(this.onChangeCb)) {
        context['onChange'] = this.onChangeCb();
      }

      if (_.isFunction(this.onDeleteCb)) {
        context['onDelete'] = this.onDeleteCb();
      }

      return Blaze.renderWithData(
        Template[template],
        context,
        parentNode || _.first(this.forms),
        nextNode,
        parentView || this.templateInstance.view
      );
    }
  },
  user: {
    userNameOrEmail(userOrUserId, { disableLastName = false } = {}) {
      let user = userOrUserId;
      if (typeof userOrUserId === 'string') {
        user = Meteor.users.findOne(userOrUserId);
      }

      if (user) {
        const {firstName='', lastName=''} = user.profile;

        if (firstName && lastName) {

          // Last name is required, so it's OK to check both firstName and lastName vars here
          return disableLastName ? firstName : `${firstName} ${lastName}`;
        } else {
          return user.emails[0].address;
        }
      } else {
        return 'Ghost';
      }
    },
    hasUser() {
      return !!Meteor.userId() || Meteor.loggingIn();
    }
  },
  roles: {
    canInviteUsers(organizationId) {
      const userId = Meteor.userId();

      if (userId && organizationId) {
        return Roles.userIsInRole(
          userId,
          UserRoles.INVITE_USERS,
          organizationId
        );
      }
    },
    canCreateAndEditStandards(organizationId) {
      const userId = Meteor.userId();

      if (userId && organizationId) {
        return Roles.userIsInRole(
          userId,
          UserRoles.CREATE_UPDATE_DELETE_STANDARDS,
          organizationId
        );
      }
    },
    canEditOrgSettings(organizationId) {
      const userId = Meteor.userId();

      if (userId && organizationId) {
        return Roles.userIsInRole(
          userId,
          UserRoles.CHANGE_ORG_SETTINGS,
          organizationId
        );
      }
    }
  },
  organization: {

    /**
     * The document is new if it was created after the user had joined the
     * organisation and was not viewed by the user:
     * @param { createdAt: Number, viewedBy: [String] } doc;
     * @param {String} userId - user ID.
    */
    isNewDoc({ doc, userId }){
      const dateUserJoinedToOrg = getJoinUserToOrganizationDate({
        organizationId: this.organizationId(), userId
      });

      if (!dateUserJoinedToOrg) {
        return false;
      }

      const viewedBy = doc.viewedBy;

      const isDocViewedByUser = !!viewedBy
                                && Match.test(viewedBy, Array)
                                && _.contains(viewedBy, userId)

      return !isDocViewedByUser && doc.createdAt > dateUserJoinedToOrg;
    },
    organization() {
      const serialNumber = this.organizationSerialNumber();
      return Organizations.findOne({ serialNumber });
    },
    organizationId() {
      return this.organization() && this.organization()._id;
    },
    organizationSerialNumber() {
      const querySerialNumberParam = FlowRouter.getParam('orgSerialNumber');
      const serialNumber = parseInt(querySerialNumberParam, 10);

      return isNaN(serialNumber) ? querySerialNumberParam : serialNumber;
    }
  },
  standard: {
    standardId() {
      return FlowRouter.getParam('standardId');
    },
    isActiveStandardFilter(filterId) {
      return this.activeStandardFilterId() === parseInt(filterId, 10);
    },
    activeStandardFilterId() {
      let id = parseInt(FlowRouter.getQueryParam('filter'));
      if (!StandardFilters[id]) {
        id = 1;
      }

      return id;
    },
    getStandardFilterLabel(id) {
      if (!StandardFilters[id]) {
        id = 1;
      }

      return StandardFilters[id];
    },
    currentStandard() {
      const _id =  FlowRouter.getParam('standardId');
      return Standards.findOne({ _id });
    },
    _getStandardsByQuery({ isDeleted = { $in: [null, false] }, ...args } = {}, options = { sort: { title: 1 } }) {
      const query = { isDeleted, ...args, organizationId: this.organizationId() };
      return Standards.find(query, options);
    },
    _getStandardByQuery(filter = {}, options = { sort: { title: 1 } }) {
      const query = { ...filter, organizationId: this.organizationId() };
      return Standards.findOne(query, options);
    }
  },
  department: {
    _getDepartmentsByQuery(filter = {}, options = { sort: { name: 1 } }) {
      const query = {
        ...filter,
        organizationId: this.organizationId()
      };

      return Departments.find(query, options)
                .map( ({ name, ...args }) => ({ title: name, name, ...args }) );
    }
  },
  date: {
    renderDate(date, format = 'DD MMM YYYY') {
      if (!_.isString(format)) {
        format = 'DD MMM YYYY';
      }
      return moment.isDate(date) ? moment(date).format(format) : 'Invalid date';
    }
  },
  callWithFocusCheck: {
    callWithFocusCheck(e, updateFn) {
      const modal = ViewModel.findOne('ModalWindow');
      modal.isWaiting(true);

      Meteor.setTimeout(() => {
        modal.isWaiting(false);

        const tpl = this.templateInstance;

        if (tpl.view.isDestroyed) {
          return;
        }

        if (tpl.$(e.target).is(':focus')) {
          return;
        }

        updateFn();
      }, 200);
    }
  },
  counter: {
    get(name) {
      return Counter.get(name);
    }
  },
  router: {
    goToDashboard(orgSerialNumber) {
      const params = { orgSerialNumber };
      FlowRouter.go('dashboardPage', params);
    },
    goToStandard(standardId, withQueryParams = true) {
      const params = { orgSerialNumber: this.organizationSerialNumber(), standardId };
      const queryParams = !!withQueryParams ? { filter: this.activeStandardFilterId() } : {};
      FlowRouter.go('standard', params, queryParams);
    },
    goToNC(nonconformityId, withQueryParams = true) {
      const params = { orgSerialNumber: this.organizationSerialNumber(), nonconformityId };
      const queryParams = !!withQueryParams ? { filter: this.activeNCFilterId() } : {};
      FlowRouter.go('nonconformity', params, queryParams);
    },
    goToNCs(withQueryParams = true) {
      const params = { orgSerialNumber: this.organizationSerialNumber() };
      const queryParams = !!withQueryParams ? { filter: this.activeNCFilterId() } : {};
      FlowRouter.go('nonconformities', params, queryParams);
    },
    goToWorkItem(workItemId, queryParams = { filter: this.activeWorkInboxFilterId() }) {
      const params = { workItemId, orgSerialNumber: this.organizationSerialNumber() };
      FlowRouter.go('workInboxItem', params, queryParams);
    },
    goToWorkInbox(withQueryParams = true) {
      const params = { orgSerialNumber: this.organizationSerialNumber() };
      const queryParams = !!withQueryParams ? { filter: this.activeWorkInboxFilterId() } : {};
      FlowRouter.go('workInbox', params, queryParams);
    },
    goToRisk(riskId, withQueryParams = true) {
      const params = { riskId, orgSerialNumber: this.organizationSerialNumber() };
      const queryParams = !!withQueryParams ? { filter: this.activeRiskFilterId() } : {};
      FlowRouter.go('risk', params, queryParams);
    },
    goToRisks(withQueryParams = true) {
      const params = { orgSerialNumber: this.organizationSerialNumber() };
      const queryParams = !!withQueryParams ? { filter: this.activeRiskFilterId() } : {};
      FlowRouter.go('risks', params, queryParams);
    }
  },
  mobile: {
    display() {
      return this.isMobile() ? 'display: block !important' : '';
    },
    isMobile() {
      return !!this.width() && this.width() < 768;
    },
    navigate(e) {
      e.preventDefault();

      if (this.isMobile()) {
        this.width(null);
      } else {
        FlowRouter.go('dashboardPage', { orgSerialNumber: this.organizationSerialNumber() });
      }
    }
  },
  filters: {
    mapFilters(filters) {
      return _.map(filters, (label, id) => {
        return {
          label: label,
          id: id
        }
      });
    }
  },
  risk: {
    riskId() {
      return FlowRouter.getParam('riskId');
    },
    isActiveRiskFilter(filterId) {
      return this.activeRiskFilterId() === parseInt(filterId, 10);
    },
    activeRiskFilterId() {
      let id = parseInt(FlowRouter.getQueryParam('filter'));
      if (!RiskFilters[id]) {
        id = 1;
      }

      return id;
    },
    getRiskFilterLabel(id) {
      if (!RiskFilters[id]) {
        id = 1;
      }

      return RiskFilters[id];
    },
    currentRisk() {
      const _id = this.riskId();
      return Risks.findOne({ _id });
    },
    _getIsDeletedQuery() {
      return this.isActiveRiskFilter('deleted') ? { isDeleted: true } : { isDeleted: { $in: [null, false] } };
    },
    _getRisksByQuery({ isDeleted = { $in: [null, false] }, ...args } = {}, options = { sort: { createdAt: -1 } }) {
      const query = { isDeleted, ...args, organizationId: this.organizationId() };
      return Risks.find(query, options);
    },
    _getRiskByQuery(filter = {}, options = { sort: { createdAt: -1 } }) {
      const query = { ...filter, organizationId: this.organizationId() };
      return Risks.findOne(query, options);
    }
  },
  nonconformity: {
    NCId() {
      return FlowRouter.getParam('nonconformityId');
    },
    isActiveNCFilter(filterId) {
      return this.activeNCFilterId() === parseInt(filterId, 10);
    },
    activeNCFilterId() {
      let id = parseInt(FlowRouter.getQueryParam('filter'));
      if (!NonConformityFilters[id]) {
        id = 1;
      }

      return id;
    },
    getNCFilterLabel(id) {
      if (!NonConformityFilters[id]) {
        id = 1;
      }

      return NonConformityFilters[id];
    },
    currentNC() {
      const _id = this.NCId();
      return NonConformities.findOne({ _id });
    },
    _getNCsByQuery({ isDeleted = { $in: [null, false] }, ...args } = {}, options = { sort: { createdAt: -1 } }) {
      const query = { isDeleted, ...args, organizationId: this.organizationId() };
      return NonConformities.find(query, options);
    },
    _getNCByQuery(filter = {}, options = { sort: { createdAt: -1 } }) {
      const query = { ...filter, organizationId: this.organizationId() };
      return NonConformities.findOne(query, options);
    }
  },
  workInbox: {
    currentWorkItem(){
      return WorkItems.findOne({ _id: this.workItemId() });
    },
    workItemId() {
      return FlowRouter.getParam('workItemId');
    },
    isActiveWorkInboxFilter(filterId) {
      return this.activeWorkInboxFilterId() === parseInt(filterId, 10);
    },
    activeWorkInboxFilterId() {
      let id = parseInt(FlowRouter.getQueryParam('filter'), 10);
      if (!WorkInboxFilters[id]) {
        id = 1;
      }

      return id;
    },
    getWorkInboxFilterLabel(id) {
      if (!WorkInboxFilters[id]) {
        id = 1;
      }

      return WorkInboxFilters[id];
    },
    _getWorkItemsByQuery(
      {
        isDeleted = { $in: [null, false] },
        organizationId = this.organizationId(),
        ...args
      } = {},
        options = { sort: { createdAt: -1 } }
    ) {
      const query = { isDeleted, organizationId, ...args };
      return WorkItems.find(query, options);
    },
    _getWorkItemByQuery(filter, options = { sort: { createdAt: -1 } }) {
      const query = { ...filter };
      return WorkItems.findOne(query, options);
    },
    _getActionsByQuery({ isDeleted = { $in: [null, false] }, ...args } = {}, options = { sort: { createdAt: -1 } }) {
      const query = { isDeleted, ...args, organizationId: this.organizationId() };
      return Actions.find(query, options);
    },
    _getActionByQuery(filter, options = { sort: { createdAt: -1 } }) {
      const query = { ...filter, organizationId: this.organizationId() };
      return Actions.findOne(query, options);
    },
    _getNameByType(type) {
      switch (type) {
        case ActionTypes.CORRECTIVE_ACTION:
          return 'Corrective action';
          break;
        case ActionTypes.PREVENTATIVE_ACTION:
          return 'Preventative action';
          break;
        case ActionTypes.RISK_CONTROL:
          return 'Risk control';
          break;
      }
    },
    _getQueryParams({ isCompleted, assigneeId = Meteor.userId() }) {
      return (userId) => {
        if (isCompleted) { // completed
          if (assigneeId === userId) {
            return { filter: 3 }; // My completed work
          } else {
            return { filter: 4 }; // Team completed work
          }
        } else {
          if (assigneeId === userId) {
            return { filter: 1 }; // My current work
          } else {
            return { filter: 2 }; // Team current work
          }
        }
      };
    }
  },
  utils: {
    capitalize(str) {
      return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
    },
    lowercase(str) {
      return str ? str.charAt(0).toLowerCase() + str.slice(1) : '';
    },
    round(num) {
      if (num >= 1000000) {
        return parseFloat((num / 1000000).toFixed(1)) + 'M';
      } else if (num >= 1000) {
        return parseFloat((num / 1000).toFixed(1)) + 'K';
      } else {
        return num;
      }
    },
    getCollectionInstance(_id, ...collections) {
      return collections.find(collection => collection instanceof Mongo.Collection && collection.findOne({ _id }));
    },
    chooseOne(predicate) {
      return (i1, i2) => predicate ? i1 : i2;
    },
    compose(...fns) {
      return fns.reduce((f, g) => (...args) => f(g(...args)));
    },
    chain(...fns) {
      return (...args) => fns.forEach(fn => fn(...args));
    },
    toArray(arrayLike = []) {
      const array = arrayLike.hasOwnProperty('collection') ? arrayLike.fetch() : arrayLike;
      return Array.from(array || []);
    },
    mapByIndex(arr, index, value) {
      return Object.assign([], arr, { [index]: { ...arr[index], ...value } });
    },
    $eq(val1, val2) {
      return val1 === val2;
    },
    $not(predicate) {
      return !predicate;
    },
    $every(...args) {
      return Array.prototype.slice.call(args, 0, args.length - 1).every(arg => !!arg);
    },
    $some(...args) {
      return Array.prototype.slice.call(args, 0, args.length - 1).some(arg => !!arg);
    }
  },
  magnitude: {
    _magnitude() {
      this.load({ mixin: 'utils' });
      return _.values(ProblemGuidelineTypes).map(type => ({ name: this.capitalize(type), value: type }) );
    }
  },
  currency: {
    getCurrencySymbol(currency) {
      switch(currency) {
        case 'EUR':
          return '€';
          break;
        case 'GBP':
          return '£';
          break;
        case 'USD':
          return '$';
          break;
        default:
          return '$';
          break;
      }
    },
    currencies() {
      return _.values(OrgCurrencies).map(c => ({ [c]: this.getCurrencySymbol(c) }) );
    }
  },
  problemsStatus: {
    getStatusName(status) {
      return ProblemsStatuses[status];
    },
    getShortStatusName(status) {
      switch(status) {
        case 4:
          return 'awaiting analysis';
          break;
        case 11:
          return 'awaiting update of standard(s)';
          break;
        default:
          return '';
          break;
      }
    },
    getClassByStatus(status) {
      switch(status) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 6:
        case 7:
        case 8:
        case 10:
        case 11:
        case 12:
        case 14:
        case 15:
          return 'warning';
        case 5:
        case 9:
        case 13:
        case 16:
        case 17:
          return 'danger';
        case 18:
        case 19:
          return 'success';
        default:
          return 'default';
      }
    }
  },
  actionStatus: {
    getStatusName(status) {
      return ActionStatuses[status];
    },
    getClassByStatus(status) {
      switch(status) {
        case 1:
        case 4:
        case 8:
        case 9:
          return 'success';
        case 2:
        case 5:
          return 'warning';
        case 3:
        case 6:
        case 7:
          return 'danger';
        default:
          return 'default';
      }
    }
  },
  workItemStatus: {
    getStatusName(status) {
      return WorkItemsStore.STATUSES[status];
    },
    getClassByStatus(status) {
      switch(status) {
        case 0:
          return 'default';
          break;
        case 1:
          return 'warning';
          break;
        case 2:
          return 'danger';
          break;
        case 3:
          return 'success';
          break;
        default:
          return 'default';
          break;
      }
    },
    IN_PROGRESS: [0, 1, 2],
    COMPLETED: 3
  },
  members: {
    _searchString() {
      const child = this.child('Select_Single') || this.child('Select_Multi');
      return child && child.value();
    },
    _members(_query = {}, options = { sort: { 'profile.firstName': 1 } }) {
      const query = {
        ...this.searchObject('_searchString', [{ name: 'profile.firstName' }, { name: 'profile.lastName' }, { name: 'emails.0.address' }]),
        ..._query
      };

      return this._mapMembers(Meteor.users.find(query, options));
    },
    _mapMembers(array) {
      return array.map(doc => ({ title: this.userNameOrEmail(doc), ...doc }));
    }
  },
  userEdit: {
    isPropChanged(propName, newVal) {
      return newVal !== this.templateInstance.data[propName];
    },
    updateProfileProperty(e, propName, withFocusCheck) {
      const propVal = this.getData()[propName];
      let updateFn;

      if (!this.isPropChanged(propName, propVal)) {
        return;
      }

      if (propVal === '') {
        updateFn = () => {
          this.parent().unsetProfileProperty(propName);
        };
      } else {
        updateFn = () => {
          this.parent().updateProfile(propName, propVal);
        };
      }

      if (withFocusCheck) {
        updateFn();
      } else {
        this.callWithFocusCheck(e, updateFn);
      }
    }
  },
  riskScore: {
    getNameByScore(score) {
      if (score >= 0 && score < 20) {
        return 'Very low';
      } else if (score >= 20 && score < 40) {
        return 'Low';
      } else if (score >= 40 && score < 60) {
        return 'Medium';
      } else if (score >= 60 && score < 80) {
        return 'High';
      } else {
        return 'Very high';
      }
    },
    getClassByScore(score) {
      if (score >= 0 && score < 25) {
        return 'vlow';
      } else if (score >= 25 && score < 50) {
        return 'low';
      } else if (score >= 50 && score < 75) {
        return 'medium';
      } else {
        return 'high';
      }
    }
  },
  reviewStatus: {
    getStatusName(status) {
      return ReviewStatuses[status];
    },
    getClassByStatus(status) {
      switch(status) {
        case 0:
          return 'danger';
          break;
        case 1:
          return 'warning';
          break;
        case 2:
          return 'success';
          break;
        default:
          return '';
          break;
      }
    }
  },
  notifications: {

    // Notifications document can be passed as an argument
    // _id is used as notification tag if there's no tag argument passed
    // Only title is required
    sendNotification({ _id, title, body, tag, icon, url, silent = true, timeout = 4000 }) {
      const notificationSound = document.getElementById('notification-sound');

      if (notificationSound) {
        notificationSound.currentTime = 0;
        notificationSound.play();
      }
      let notification = new Notification(title, {
        body,
        tag: tag || _id,
        icon: icon || '/p-logo-square.png',
        silent
      });

      if (url) {
        notification.onclick = function () {
          window.open(url);
        };
      }

      Meteor.setTimeout(() => {
        notification.close();
      }, timeout);
    },
    playNewMessageSound() {
      const $sound = document.getElementById('message-sound');

      if ($sound) {
        $sound.currentTime = 0;
        invoke($sound, 'play');
      }
    }
  },
  discussions: {
    discussionHasMessages(discussionId) {
      return Messages.find({ discussionId }).count();
    },
    _getDiscussionIdByStandardId(standardId) {
      const query = { documentType: DocumentTypes.STANDARD, linkedTo: standardId };
      const options = { fields: { _id: 1 } };
  		const discussion = Discussions.findOne(query, options);

  		return discussion ? discussion._id : null;
  	},
    _getDiscussionIdsByStandardId(standardId) {
      const query = { documentType: DocumentTypes.STANDARD, linkedTo: standardId };
      const options = { fields: { _id: 1 } };
  		const discussionIds = Discussions.find(query, options).map(
        c => c._id
      );

  		return discussionIds;
  	}
  },
  messages: {
    _getMessages({ query, options }){
      return Messages.find(query, options);
    },
    _getMessageByDiscussionId(discussionId, protection = {}) {
      return Messages.findOne({ discussionId }, protection);
    },
    _getMessagesByDiscussionId(discussionId, protection = {}) {
      return Messages.find({ discussionId }, protection);
    }
  },
  uploader: {
    uploadData(fileId) { // find the file with fileId is being uploaded
      return _.find(this.uploads().array(), (data) => {
        return data.fileId === fileId;
      });
    },
    terminateUploading(fileId) {
      const uploadData = this.uploadData(fileId);
      const uploader = uploadData && uploadData.uploader;
      if (uploader) {
        uploader.xhr && uploader.xhr.abort();
        this.removeUploadData(fileId);
      }
      terminateUploading.call({
        _id: fileId
      });
    },
    removeUploadData(fileId) {
      this.uploads().remove((item) => {
        return item.fileId === fileId;
      });
    },
    uploads() {
      this.load({ share: 'uploader' });

      return this.uploads();
    },
    upload({
        files,
        maxSize,
        beforeUpload
      }) {
      if (!files.length) {
        return;
      }

      const { slingshotDirective, metaContext, addFile, afterUpload } = this.templateInstance.data;

      beforeUpload && beforeUpload();

      _.each(files, (file) => {
        const name = file.name;

        if (file.size > maxSize) {
          toastr.error(`${file.name} size exceeds the allowed maximum of ${maxSize/1024/1024} MB`);

          return;
        }

        insertFile.call({
          name: name,
          extension: name.split('.').pop().toLowerCase(),
          organizationId: this.organizationId()
        }, (err, fileId) => {
          if (err) {
            this.terminateUploading(fileId);
            throw err;
          }

          addFile && addFile({ fileId });

          const uploader = new Slingshot.Upload(
            slingshotDirective, metaContext
          );

          const progressInterval = Meteor.setInterval(() => {
            const progress = uploader.progress();

            if (!progress && progress != 0 || progress === 1) {
              Meteor.clearInterval(progressInterval);
            } else {
              updateProgress.call({ _id: fileId, progress }, (err, res) => {
                if (err) {
                  Meteor.clearInterval(progressInterval);
                  this.terminateUploading(fileId);

                  throw err;
                }
              });
            }
          }, 1500);

          this.uploads().push({ fileId: fileId, uploader });

          uploader.send(file, (err, url) => {
            if (err) {

              this.terminateUploading(fileId);
              return;
            }

            if (url) {
              url = encodeURI(url);
            }

            afterUpload && afterUpload({ fileId, url });

            updateUrl.call({ _id: fileId, url });
            updateProgress.call({ _id: fileId, progress: 1 }, (err, res) => {
              this.removeUploadData(fileId);
            });
          });
        });
      });
    },
  }
};
