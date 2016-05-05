import { ViewModel } from 'meteor/manuel:viewmodel';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Organizations } from '/imports/api/organizations/organizations.js';

ViewModel.persist = false;

ViewModel.mixin({
  collapse: {
    collapsed: true,
    toggleCollapse: _.throttle(function() {
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
    }, 500)
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
      setError(err) {
        this.instance().setError(err);
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
        const r = new RegExp(`.*${this[prop]()}.*`, 'i');
        if (_.isArray(fields)) {
          fields = _.map(fields, (field) => {
            const obj = {};
            obj[field] = r;
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
      const result = string.match(/^[\d\.]*\d/);
      return result;
    }
  },
  addForm: {
    addForm(template) {
      Blaze.renderWithData(
        Template[template],
        {
          onChange: this.onChangeCb(),
          onDelete: this.onDeleteCb()
        },
        this.forms[0]
      );
    }
  },
  editableModalSection: {
    editableModal() {
      return this.parent().child('EditableModal');
    },
    isSaving(val) {
      const editableModal = this.editableModal();

      if (val !== undefined) {
        editableModal.isSaving(val);
      }

      return editableModal.isSaving();
    },
    callMethod(method, args, cb) {
      return this.editableModal().callMethod(method, args, cb);
    },
    handleMethodResult(cb) {
      return this.editableModal().handleMethodResult(cb);
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
    email(user) {
      return user.emails[0].address;
    },
    address(user) {
      const { address='' } = user.profile;
      return address;
    },
    avatar(user) {
      return user.profile.avatar;
    },
    description(user) {
      return user.profile.description;
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
  organization: {
    subHandler: null,
    subscribe(orgId) {
      this.subHandler(Meteor.subscribe('currentUserOrganizationById', orgId));
    },
    organization() {
      const serialNumber = parseInt(FlowRouter.getParam('orgSerialNumber'));
      return Organizations.findOne({ serialNumber });
    },
  }
});
