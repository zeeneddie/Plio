import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';
import { Standards } from '/imports/api/standards/standards.js';
import { UserRoles, StandardFilters } from '/imports/api/constants.js';

const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
const vimeoRegex = /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;

ViewModel.persist = false;

ViewModel.mixin({
  collapse: {
    collapsed: true,
    toggleCollapse: _.throttle(function() {
      if (this.closeAllOnCollapse && this.closeAllOnCollapse()) {
        // hide other collapses
        ViewModel.find('ListItem').forEach((vm) => {
          if (!!vm && vm.collapse && !vm.collapsed() && vm.vmId !== this.vmId && vm.type() === this.type()) {
            vm.collapse.collapse('hide');
            vm.collapsed(true);
          }
        });
      }
      this.collapse.collapse('toggle');
      this.collapsed(!this.collapsed());
    }, 500)
  },
  collapsing: {
    toggleVMCollapse(name = '', condition = () => {}) {
      if (name) {
        const vmToCollapse = ViewModel.findOne(name, condition);

        !!vmToCollapse && vmToCollapse.collapse && vmToCollapse.toggleCollapse();
      }
    },
    expandCollapsedStandard(standardId) {
      const standard = Standards.findOne({ _id: standardId });
      if (standard) {
        Meteor.setTimeout(() => {
          this.toggleVMCollapse('ListItem', (viewmodel) => {

            // Check if the section has parent (Type) collapsible list
            if (viewmodel.parent().parent && viewmodel.parent().parent()._id) {
              return viewmodel.type() === 'standardSection' &&
                viewmodel.collapsed() &&

                // viewmodel.parent() => StandardsSectionItem
                viewmodel.parent()._id &&
                viewmodel.parent()._id() === standard.sectionId &&

                // viewmodel.parent().parent() => StandardsTypeItem
                viewmodel.parent().parent()._id() === standard.typeId;
            } else {
              return viewmodel.type() === 'standardSection' &&
                viewmodel.collapsed() &&
                viewmodel.parent()._id &&
                viewmodel.parent()._id() === standard.sectionId;
            }
          });
          this.toggleVMCollapse('ListItem', (viewmodel) => {
            return viewmodel.type() === 'standardType' &&
              viewmodel.collapsed() &&

              // viewmodel.parent() => StandardsSectionItem
              viewmodel.parent()._id &&
              viewmodel.parent()._id() === standard.typeId
          });
        }, 500);
      }
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
        const vm = this.instance();
        return !!vm && vm.modal.modal('hide');
      },
      isSaving(val) {
        const instance = this.instance();

        if (val !== undefined) {
          instance.isSaving(val);
        }

        return instance.isSaving();
      },
      isWaiting(val) {
        const instance = this.instance();

        if (val !== undefined) {
          instance.isWaiting(val);
        }

        return instance.isWaiting();
      },
      setError(err) {
        this.instance().setError(err);
      },
      clearError() {
        this.instance().clearError();
      },
      callMethod(method, args, cb) {
        return this.instance().callMethod(method, args, cb);
      },
      handleMethodResult(cb) {
        return this.instance().handleMethodResult(cb);
      }
    }
  },
  search: {
    searchObject(prop, fields) {
      const searchObject = {};

      if (this[prop]()) {
        const words = this[prop]().split(' ');
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
  organizations: {
    subHandler: null,
    subscribe() {
      this.subHandler(Meteor.subscribe('currentUserOrganizations'));
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
    subHandler: null,
    subscribe(orgId) {
      this.subHandler(Meteor.subscribe('currentUserOrganizationById', orgId));
    },
    organization() {
      const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'), 10);
      return Organizations.findOne({ serialNumber });
    },
    organizationId() {
      return this.organization() && this.organization()._id;
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
    },
    datepickerInit() {
      this.datepicker.datepicker({
        startDate: new Date(),
        format: 'dd MM yyyy',
        autoclose: true
      });
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

        if (this.templateInstance.$('input').is(':focus')) {
          return;
        }

        updateFn();
      }, 200);
    }
  }
});
