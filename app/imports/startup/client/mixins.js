import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { Standards } from '/imports/api/standards/standards.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';
import { Problems } from '/imports/api/problems/problems.js';
import { UserRoles, StandardFilters, RiskFilters, NonConformityFilters, NCTypes, NCStatuses, OrgCurrencies } from '/imports/api/constants.js';
import Counter from '/imports/api/counter/client.js';

const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
const vimeoRegex = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;

ViewModel.persist = false;

ViewModel.mixin({
  collapse: {
    collapsed: true,
    toggleCollapse: _.throttle(function(cb) {
      if (this.closeAllOnCollapse && this.closeAllOnCollapse()) {
        // hide other collapses
        ViewModel.find('ListItem').forEach((vm) => {
          if (!!vm && vm.collapse && !vm.collapsed() && vm.vmId !== this.vmId) {
            vm.collapse.collapse('hide');
            vm.collapsed(true);
          }
        });
      }

      this.collapse.collapse('toggle');
      this.collapsed(!this.collapsed());
      if (_.isFunction(cb)) cb();
    }, 500)
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

      this.expandCollapseItems(vms, { complete: cb });
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
        const r = new RegExp(`.*(${words.join('|')}).*`, 'i');
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
    },
    searchOnAfterKeyUp: _.debounce(function(e) {
      const value = e.target.value;

      if (this.searchText() === value) return;

      this.searchText(value);

      if (this.isActiveStandardFilter) {
        if (this.isActiveStandardFilter('deleted')) return;
      } else if (this.isActiveNCFilter) {
        if (this.isActiveNCFilter('deleted')) return;
      }

      if (!!value) {
        this.expandAllFound();
      } else {
        this.expandSelected();
      }
    }, 500)
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
    addForm(template, context = {}) {
      if (_.isFunction(this.onChangeCb)) {
        context['onChange'] = this.onChangeCb();
      }

      if (_.isFunction(this.onDeleteCb)) {
        context['onDelete'] = this.onDeleteCb();
      }

      return Blaze.renderWithData(
        Template[template],
        context,
        this.forms[0]
      );
    }
  },
  user: {
    userFullNameOrEmail(userOrUserId) {
      let user = userOrUserId;
      if (typeof userOrUserId === 'string') {
        user = Meteor.users.findOne(userOrUserId);
      }

      if (user) {
        const {firstName='', lastName=''} = user.profile;

        if (firstName && lastName) {
          return `${firstName} ${lastName}`;
        } else {
          return user.emails[0].address;
        }
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
    canCreateStandards(organizationId) {
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
    isActiveStandardFilter(filter) {
      return this.activeStandardFilter() === filter;
    },
    activeStandardFilter() {
      return FlowRouter.getQueryParam('by') || StandardFilters[0];
    },
    currentStandard() {
      const _id =  FlowRouter.getParam('standardId');
      return Standards.findOne({ _id });
    },
    _getStandardsByQuery(by = {}, options = { sort: { title: 1 } }) {
      const query = { ...by, organizationId: this.organizationId() };
      return Standards.find(query, options);
    },
    _getStandardByQuery(by = {}, options = { sort: { title: 1 } }) {
      const query = { ...by, organizationId: this.organizationId() };
      return Standards.findOne(query, options);
    }
  },
  date: {
    renderDate(date) {
      return moment.isDate(date) && moment(date).format('DD MMM YYYY');
    }
  },
  filesList: {
    fileUploader() {
      return this.child('FileUploader');
    },
    fileProgress(fileId) {
      return this.fileUploader() && this.fileUploader().progress(fileId);
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
      const queryParams = !!withQueryParams ? { by: this.activeStandardFilter() } : {};
      FlowRouter.go('standard', params, queryParams);
    },
    goToNC(nonconformityId, withQueryParams = true) {
      const params = { orgSerialNumber: this.organizationSerialNumber(), nonconformityId };
      const queryParams = !!withQueryParams ? { by: this.activeNCFilter() } : {};
      FlowRouter.go('nonconformity', params, queryParams);
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
  risk: {
    riskId() {
      return FlowRouter.getParam('riskId');
    },
    currentRisk() {
      const _id = this.riskId();
      // return Risks.findOne({ _id });
    }
  },
  nonconformity: {
    NCId() {
      return FlowRouter.getParam('nonconformityId');
    },
    isActiveNCFilter(filter) {
      return this.activeNCFilter() === filter;
    },
    activeNCFilter() {
      return FlowRouter.getQueryParam('by') || NonConformityFilters[0];
    },
    currentNC() {
      const _id = this.NCId();
      return NonConformities.findOne({ _id });
    },
    _getNCsByQuery(by = {}, options = { sort: { title: 1 } }) {
      const query = { ...by, organizationId: this.organizationId() };
      return NonConformities.find(query, options);
    },
    _getNCByQuery(by = {}, options = { sort: { title: 1 } }) {
      const query = { ...by, organizationId: this.organizationId() };
      return NonConformities.findOne(query, options);
    }
  },
  utils: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    round(num) {
      if (num >= 1000000) {
        return parseFloat((num / 1000000).toFixed(1)) + 'M';
      } else if (num >= 1000) {
        return parseFloat((num / 1000).toFixed(1)) + 'K';
      } else {
        return num;
      }
    }
  },
  magnitude: {
    _magnitude() {
      this.load({ mixin: 'utils' });
      return _.values(NCTypes).map(type => ({ name: this.capitalize(type), value: type }) );
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
  NCStatus: {
    getStatusName(status) {
      return NCStatuses[status];
    },
    getClassByStatus(status) {
      switch(status) {
        case 1:
        case 13:
          return 'success';
          break;
        case 2:
        case 4:
        case 5:
        case 6:
        case 8:
        case 9:
        case 11:
          return 'warning';
          break;
        case 3:
        case 7:
        case 10:
        case 12:
          return 'danger';
          break;
        default:
          return '';
          break;
      }
    }
  },
  members: {
    _searchString() {
      const child = this.child('SelectItem');
      return child && child.value();
    },
    _members(_query = {}, options = { sort: { 'profile.firstName': 1 } }) {
      const query = {
        ...this.searchObject('_searchString', [{ name: 'profile.firstName' }, { name: 'profile.lastName' }, { name: 'emails.0.address' }]),
        ..._query
      };

      return Meteor.users.find(query, options).map(({ _id, ...args }) => ({ title: this.userFullNameOrEmail(_id), _id, ...args }) );
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
  }
});
