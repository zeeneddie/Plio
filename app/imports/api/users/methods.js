import { Meteor } from 'meteor/meteor';
import { ValidationError } from 'meteor/mdg:validation-error';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';

import UserService from './user-service';
import { UserProfileSchema, PhoneNumberSchema } from '/imports/share/schemas/user-schema';
import { IdSchema, UserIdSchema } from '/imports/share/schemas/schemas';
import { UserRoles } from '/imports/share/constants';
import Method from '../method';
import { withUserId, chain, mapArgsTo, compose } from '/imports/api/helpers';
import {
  USR_EnsureUpdatingHimselfChecker,
  USR_EnsureCanChangeRolesChecker,
  USR_EnsureIsNotOrgOwnerChecker,
} from '../checkers';

const ensureUpdatingHimself = withUserId(USR_EnsureUpdatingHimselfChecker);

const ensureCanChangeRoles = withUserId(USR_EnsureCanChangeRolesChecker);

const userIdToId = ({ userId: _id }) => ({ _id });

export const remove = new Method({
  name: 'Users.remove',

  validate: new SimpleSchema({}).validator(),

  run() {
    return UserService.remove({ _id: this.userId });
  },
});

export const updateProfile = new Method({
  name: 'Users.updateProfile',

  validate(doc) {
    const validationContext = new SimpleSchema([
      IdSchema,
      UserProfileSchema,
    ]).newContext();

    for (const key in doc) {
      if (!validationContext.validateOne(doc, key)) {
        const errors = validationContext.invalidKeys();
        const message = validationContext.keyErrorMessage(errors[0].name);
        throw new ValidationError(errors, message);
      }
    }
  },

  check(checker) {
    return checker(ensureUpdatingHimself(this.userId));
  },

  run({ _id, ...args }) {
    UserService.updateProfile(_id, args);
  },
});

export const unsetProfileProperty = new Method({
  name: 'Users.unsetProfileProperty',

  validate: new SimpleSchema([
    IdSchema,
    {
      fieldName: {
        type: String,
        allowedValues: UserProfileSchema.objectKeys(),
      },
    },
  ]).validator(),

  check(checker) {
    return checker(ensureUpdatingHimself(this.userId));
  },

  run({ _id, fieldName }) {
    const fieldDef = UserProfileSchema.getDefinition(fieldName);
    if (!(fieldDef.optional === true)) {
      throw new Meteor.Error(
        400,
        UserProfileSchema.messageForError('required', fieldName, null, ''),
      );
    }

    UserService.unsetProfileProperty({ _id, fieldName });
  },
});

export const updateEmail = new Method({
  name: 'Users.updateEmail',

  validate: new SimpleSchema([IdSchema, {
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email,
    },
  }]).validator(),

  check(checker) {
    return checker(ensureUpdatingHimself(this.userId));
  },

  run({ _id, email }) {
    return UserService.updateEmail(_id, email);
  },
});

export const updatePhoneNumber = new Method({
  name: 'Users.updatePhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    PhoneNumberSchema,
  ]).validator(),

  check(checker) {
    return compose(checker, mapArgsTo)(ensureUpdatingHimself(this.userId), userIdToId);
  },

  run({ userId, ...args }) {
    return UserService.updatePhoneNumber({ userId, ...args });
  },
});

export const addPhoneNumber = new Method({
  name: 'Users.addPhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    PhoneNumberSchema,
  ]).validator(),

  check(checker) {
    return compose(checker, mapArgsTo)(ensureUpdatingHimself(this.userId), userIdToId);
  },

  run({ userId, ...args }) {
    return UserService.addPhoneNumber({ userId, ...args });
  },
});

export const removePhoneNumber = new Method({
  name: 'Users.removePhoneNumber',

  validate: new SimpleSchema([
    UserIdSchema,
    IdSchema,
  ]).validator(),

  check(checker) {
    return compose(checker, mapArgsTo)(ensureUpdatingHimself(this.userId), userIdToId);
  },

  run({ userId, ...args }) {
    return UserService.removePhoneNumber({ userId, ...args });
  },
});

const changeRoleSchema = new SimpleSchema([IdSchema, {
  organizationId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  role: {
    type: String,
    allowedValues: _.values(UserRoles),
  },
}]);

export const assignRole = new Method({
  name: 'Users.assignRole',

  validate: changeRoleSchema.validator(),

  check(checker) {
    return compose(checker, chain)(
      USR_EnsureIsNotOrgOwnerChecker,
      ensureCanChangeRoles(this.userId),
    );
  },

  run({ _id, organizationId, role }) {
    return Roles.addUsersToRoles(_id, role, organizationId);
  },
});

export const revokeRole = new Method({
  name: 'Users.revokeRole',

  validate: changeRoleSchema.validator(),

  check(checker) {
    return compose(checker, chain)(
      USR_EnsureIsNotOrgOwnerChecker,
      ensureCanChangeRoles(this.userId),
    );
  },

  run({ _id, organizationId, role }) {
    return Roles.removeUsersFromRoles(_id, role, organizationId);
  },
});

export const sendVerificationEmail = new Method({
  name: 'Users.sendVerificationEmail',

  validate: new SimpleSchema({}).validator(),

  run() {
    if (this.isSimulation) return undefined;

    return Accounts.sendVerificationEmail(this.userId);
  },
});

export const setNotifications = new Method({
  name: 'Users.preferences.setNotifications',

  validate: new SimpleSchema([
    IdSchema,
    {
      enabled: { type: Boolean },
    },
  ]).validator(),

  check(checker) {
    return checker(ensureUpdatingHimself(this.userId));
  },

  run({ _id, enabled }) {
    return UserService.setNotifications({ _id, enabled });
  },
});

export const setNotificationSound = new Method({
  name: 'Users.setNotificationSound',

  validate: new SimpleSchema([
    IdSchema,
    {
      soundFile: { type: String },
    },
  ]).validator(),

  check(checker) {
    return checker(ensureUpdatingHimself(this.userId));
  },

  run({ _id, soundFile }) {
    return UserService.setNotificationSound({ _id, soundFile });
  },
});

export const setEmailNotifications = new Method({
  name: 'Users.preferences.setEmailNotifications',

  validate: new SimpleSchema({
    enabled: { type: Boolean },
  }).validator(),

  run({ enabled }) {
    const _id = this.userId;

    return UserService.setEmailNotifications({ _id, enabled });
  },
});
