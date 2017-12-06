import { Template } from 'meteor/templating';
import { ViewModel } from 'meteor/manuel:viewmodel';
import pluralize from 'pluralize';
import moment from 'moment-timezone';

import { inviteMultipleUsersByEmail } from '/imports/api/organizations/methods';
import { ALERT_AUTOHIDE_TIME } from '/imports/api/constants';

Template.UserDirectory_InviteUsers.viewmodel({
  mixin: ['modal', 'organization'],
  welcomeMessage: 'Hi there.\nWe\'ll be using Plio to share standards documents, to record non-conformities and risks and to track actions. See you soon.',
  usersEntries: _.range(0, 4).map(i => ({ avatarIndex: i })),

  save() {
    const emailViewModels = this.children('UserDirectory_InviteUsers_UserEntry');
    const emails = emailViewModels
      .map(userEntryViewModel => userEntryViewModel.email()) // get emails
      .filter(email => !!email); // get rid of empty strings

    if (emails.length <= 0) {
      this.modal().setError('You need to fill in at least one valid email address first');
      return;
    }

    const welcomeMessage = this.welcomeMessage();
    const organizationId = this.organizationId();

    if (emails.length > 0) {
      this.modal().callMethod(inviteMultipleUsersByEmail, {
        organizationId, emails, welcomeMessage,
      }, (err, res) => {
        if (!err) {
          const organization = this.organization();
          const organizationName = organization && organization.name || 'organization';
          const invitedEmails = res.invitedEmails || [];
          const addedEmails = res.addedEmails || [];
          const invitedEmailsText = invitedEmails.length > 0 ? `${pluralize('Invite', invitedEmails.length)} to ${invitedEmails.join(', ')} ${invitedEmails.length > 1 ? 'were' : 'was'} sent successfully.\n` : '';
          const addedEmailsText = addedEmails.length > 0 ? `${addedEmails.join(', ')} ${addedEmails.length > 1 ? 'are already Plio users. These users have' : 'is already a Plio user. This user has'} now been added to the ${organizationName} organization in Plio.\n` : '';
          const successMessagePart = `${invitedEmailsText}${addedEmailsText}`;
          const failMessagePart = res.error ? `\n${res.error}` : '';

          let notificationTitle;
          if (failMessagePart) {
            if (successMessagePart) {
              notificationTitle = 'Some users were not invited!';
            } else {
              notificationTitle = 'Not invited!';
            }
          } else {
            notificationTitle = 'Invited!';
          }

          const expirationMessagePart = invitedEmailsText.length ? `\nInvitation expiration date: ${moment().add(res.expirationTime, 'days').format('MMMM Do YYYY')}` : '';
          swal({
            title: notificationTitle,
            text: `${successMessagePart}${failMessagePart}${expirationMessagePart}`,
            type: failMessagePart ? 'error' : 'success',
            timer: ALERT_AUTOHIDE_TIME,
            showConfirmButton: false,
          });
          this.modal().close();
        }
      });
    }
  },
});
