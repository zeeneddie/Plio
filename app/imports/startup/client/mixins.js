import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { Standards } from '/imports/api/standards/standards.js';
import { UserRoles, StandardFilters } from '/imports/api/constants.js';
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
    expandCollapsedStandard: _.debounce(function(_id, cb) {
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

      return item.toggleCollapse(() => {
        !!expandNotExpandable && !!closeAllOnCollapse && item.closeAllOnCollapse(true);

        if (index === array.length - 1 && _.isFunction(complete)) complete();

        return this.expandCollapseItems(array, { index: index + 1, complete, expandNotExpandable });
      });
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

      Blaze.renderWithData(
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
      return parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
    }
  },
  standard: {
    standardId() {
      return FlowRouter.getParam('standardId');
    },
    activeStandardFilter() {
      return FlowRouter.getQueryParam('by') || StandardFilters[0];
    },
    isActiveStandardFilter(filter) {
      return this.activeStandardFilter() === filter;
    },
    currentStandard() {
      const _id =  FlowRouter.getParam('standardId');
      return Standards.findOne({ _id });
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
  clearableField: {
    callWithFocusCheck(updateFn) {
      this.modal().isWaiting(true);

      Meteor.setTimeout(() => {
        this.modal().isWaiting(false);

        if (this.templateInstance.view.isDestroyed) {
          return;
        }

        if (this.templateInstance.$('input').is(':focus')) {
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
  }
});
